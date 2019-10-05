import * as Discord from 'discord.js';
import { mkdirSync } from 'fs';
import { resolve } from 'path';
import { createStore, Store } from 'redux';
import { isUndefined } from 'util';
import * as botConfig from '../assets/bot.config.json';
import BotNative from '../plugins/native-plugin/native-plugin';
import { BotStore, storeRoot } from '../store/bot-store';
import { actionUserInteracted, DirtBoiUserProfile } from '../store/user-store';
import './bot-commands';
import { CommandPermission, Commands, ScopePermission } from './bot-commands';
import { dispatchMessage } from './bot-events.js';
import { BotCommand, BotPlugin } from './bot-plugin';
import BotService from './bot-service';
import { MessageSource, sendMessage } from './message-source';
import { resolvePermission, UserPermission } from './user-permission.js';

export default class BotClient {
    readonly path: string
    readonly assetPath: string
    readonly cachePath: string
    readonly store: Store<BotStore>
    
    private state: 'offline' | 'login' | 'online' | 'error'
    private token: string = ''
    private client: Discord.Client
    private plugins: Map<string, BotPlugin>
    private serviceMap: Map<string, BotService>
    private initializationQueue: BotPlugin[]
    
    constructor(path: string) {
        this.path = path
        this.assetPath = resolve(path, 'assets/')
        this.cachePath = resolve(path, 'cache/')
        this.token = botConfig.client.token
        this.client = new Discord.Client()
        this.store = createStore(storeRoot)
        this.state = 'offline'
        this.plugins = new Map<string, BotPlugin>()
        this.serviceMap = new Map<string, BotService>()

        this.initializationQueue = []

        this.client
        .on('ready', this.onConnectionReady)
        .on('message', this.onMessage)

        mkdirSync(this.cachePath, {recursive: true})
    }
    
    // API
    run() {
        return new Promise((resolve, reject) => {
            let botVersion = process.env.npm_package_version || botConfig.version
            console.log(`: DirtBoi ${botVersion}`)
            console.log(`: connecting`)
            this.state = 'login'
            this.client.login(this.token).then((token) => {
                console.log(`: received token: ${token}`)
                this.registerPlugin(BotNative)
                resolve()
            }).catch((error) => {
                this.state = 'error'
                console.log(`: failed to login`)
                console.error(error)
                reject()
            })
        })
    }

    getService<T>(name: string): T {
        const service: BotService | undefined = this.serviceMap.get(name)
        if ( !isUndefined(service)) {
            return service.service as T
        }
        throw `unknown service: ${name}`
    }
        
    registerCommand(cmd: BotCommand) {
        if ( Commands.registerCommand(this, cmd) ) {
            console.log(`: registered command ${cmd.identifier}`)
        }
        else {
            console.log(`: unable to initialize command ${cmd.identifier}`)            
        }
    }

    registerService(service: BotService) {
        this.serviceMap.set(service.name, service)
        console.log(`: starting service ${service.name}`)
        service.run(this)
    }

    registerPlugin(plugin: BotPlugin) {
        if ( this.initializationQueue.length > 0) {
            this.initializationQueue.push(plugin)
            return
        }
        this.initializationQueue.push(plugin)
        this.initializePlugin(plugin)
    }


    removeService(name: string) {
        if ( this.serviceMap.has(name) ) {
            const service = (this.serviceMap.get(name) as BotService)
            if ( service.stop ) {
                if ( !service.stop(this) ) {
                    console.log(`: failed to stop service ${name} properly`)
                }
            }
            this.serviceMap.delete(name)
        } 
    }

    // internal
    private initializePlugin(plugin: BotPlugin) {
        const initializationTimeout = () => {
            if ( asyncServices > 0 ) {
                console.log(`: failed to initialize plugin ${plugin.name}`)
            }
        }

        const checkQueue = () => {
            if ( asyncServices === 0 ) {
                this.completePluginInitialization(plugin)
            }
        }

        console.log(`: trying to register plugin ${plugin.name}`)

        let services: BotService[] = plugin.services || []
        let error: boolean = false
        let asyncServices = 0

        for(let i = 0; i < services.length; ++i) {
            let res = services[i].run(this)

            if ( typeof res === 'boolean') {
                if ( !(res as boolean) ) {
                    error = true
                } else {
                    console.log(`: service ${services[i].name} successfully initialized`)
                    this.serviceMap.set(services[i].name, services[i])
                }
            } else {
                ++asyncServices
                let p: Promise<boolean> = res
                p.then((success => {
                    if ( success ) {
                        console.log(`: service ${services[i].name} successfully initialized`)
                        asyncServices--
                        this.serviceMap.set(services[i].name, services[i])
                        checkQueue()
                    } 
                }))
            }
        }
        
        if ( error ) {
            console.log(`: failed to initialize plugin ${plugin.name}`)
        }
        else {
            if ( asyncServices === 0 ) {
                this.completePluginInitialization(plugin)
            } else {
                setTimeout(initializationTimeout, 1000 * 20);
            }
        }
    }

    private completePluginInitialization(plugin: BotPlugin) {
        let commands: BotCommand[] = plugin.commands || []

        if ( this.initializationQueue.includes(plugin))
            this.initializationQueue.splice(this.initializationQueue.indexOf(plugin), 1)
        
        if ( !isUndefined(plugin.initializationCallback))
            plugin.initializationCallback(this)

        for(let i = 0; i < commands.length; ++i) {
            this.registerCommand(commands[i])
        }

        console.log(`: registered plugin ${plugin.name}`)

        if ( this.initializationQueue.length > 0 ) {
            this.initializePlugin(this.initializationQueue[0])
        }

        this.plugins.set(plugin.name, plugin)
    }

    private abortPluginInitialization(plugin: BotPlugin) {
        console.log(`: removing plugin ${plugin}`)
        if ( this.initializationQueue.includes(plugin))
            this.initializationQueue.splice(this.initializationQueue.indexOf(plugin), 1)

        // remove added services
        let services = plugin.services || []

        for(let i = 0; i < services.length; ++i) 
            this.removeService(services[i].name)
    }

    private onConnectionReady() {
        console.log(`: client connected`)
    }

    private onMessage = (msg: Discord.Message) => {
        let author = msg.author
        let channel = msg.channel as Discord.TextChannel
        this.store.dispatch(actionUserInteracted(author))

        const owners: string[] = botConfig.client.owners || []

        const profile: DirtBoiUserProfile = {
            nick: author.username,
            rank: 0,
            botOwner: owners.includes(author.id)
        }
        const source: MessageSource.Source  = {
            channel: channel,
            user: author,
            profile: profile
        }

        if ( Commands.isBotCommand(msg.content) ) {
            if ( Commands.isValidBotCommand(msg.content)) {
                const userPermissions = resolvePermission(author, profile, channel)
                const cmdInstance = Commands.createInstance(this, msg.content, source)

                if ( this.testPermission(userPermissions, cmdInstance.permissions)) {
                    cmdInstance.invoke()
                } else {
                    sendMessage(channel, `permission denied (${cmdInstance.permissions.scope})`, {expires: 5})
                }
            }
        }

        dispatchMessage('guild', channel.guild.id, source, msg.content)
    }  

    private testPermission = (userPermission: UserPermission, commandPermission: CommandPermission) => {
        return userPermission.scope != ScopePermission.None && userPermission.scope >= commandPermission.scope
    }
}

import * as Discord from 'discord.js';
import { resolve } from 'path';
import { createStore, Store } from 'redux';
import { isUndefined } from 'util';
import botConfig from '../assets/bot.config.json';
import BotNative from '../plugins/native-plugin/native-plugin';
import { BotStore, storeRoot } from '../store/bot-store';
import { actionUserInteracted } from '../store/user-store';
import './bot-commands';
import { Commands } from './bot-commands';
import { BotCommand, BotPlugin } from './bot-plugin';
import BotService from './bot-service';
import { MessageSource } from './message-source';
import {version} from '../assets/bot.config.json'

export default class BotClient {
    path: string
    assetPath: string
    token: string = ''
    private client: Discord.Client
    private serviceMap: Map<string, BotService>
    store: Store<BotStore>
    config: object

    plugins: Map<string, BotPlugin>

    private initializationQueue: BotPlugin[]
    
    constructor(path: string, token: string) {
        this.path = path
        this.assetPath = resolve(path, 'assets/')
        this.token = token
        this.client = new Discord.Client()
        this.serviceMap = new Map<string, BotService>()
        this.store = createStore(storeRoot)
        this.config = botConfig

        this.plugins = new Map<string, BotPlugin>()
        this.initializationQueue = []

        this.client
        .on('ready', this.onConnectionReady)
        .on('message', this.onMessage)

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
    
    private initializePlugin(plugin: BotPlugin) {
        console.log(`: trying to register plugin ${plugin.name}`)

        let services: BotService[] = plugin.services || []
        let commands: BotCommand[] = plugin.commands || []

        let error: boolean = false
        let asyncServices = 0

        for(let i = 0; i < services.length; ++i) {
            let res = services[i].run(this)

            if ( typeof res === 'boolean') {
                if ( !(res as boolean) ) {
                    error = true
                } else {
                    console.log(`: service ${services[i].name} successfully initialized`)
                }
            } else {
                ++asyncServices
                let p: Promise<boolean> = res
                p.then((success => {
                    if ( success ) {
                        console.log(`: service ${services[i].name} successfully initialized`)
                        asyncServices--
                        checkQueue()
                    } 
                }))
            }
        }


        if ( asyncServices === 0 ) {
            this.completePluginInitialization(plugin)
        }

        if ( error ) {
            console.log(`: failed to initialize plugin ${plugin.name}`)
        }


        const initializationTimeout = () => {
            if ( asyncServices > 0 ) {
                console.log(`: failed to initialize plugin ${plugin.name}`)
            }
        }

        setTimeout(initializationTimeout, 1000 * 30);

        const checkQueue = () => {
            if ( asyncServices === 0 ) {
                this.completePluginInitialization(plugin)
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
    }


    getService<T>(name: string): T | undefined {
        const service: BotService | undefined = this.serviceMap.get(name)
        if ( !isUndefined(service)) {
            return service.service as T
        }
        return undefined
    }
    
    private onConnectionReady() {
        console.log(`: client connected`)
    }

    private onMessage = (msg: Discord.Message) => {
        let author = msg.author

        let channel = msg.channel as Discord.TextChannel
        this.store.dispatch(actionUserInteracted(author))

        if ( Commands.isBotCommand(msg.content) ) {
            if ( Commands.isValidBotCommand(msg.content)) {

                const profile = this.store.getState().users[author.id]
                const source: MessageSource.Source  = {
                    channel: channel,
                    user: author,
                    profile: profile
                }

                Commands.invokeCommand(msg.content, source)
            }
            else  {
                console.log(`: unknown command ${msg.content}`)
            }
        }
    }
    
    run() {
        let botVersion = process.env.npm_package_version || version
        console.log(`: DirtBoi ${botVersion}`)
        console.log(`: connecting`)
        this.client.login(this.token)
        // this.registerService(apiService)
        this.registerPlugin(BotNative)
    }

    // old
    registerCommand(cmd: Commands.Command) {
        if ( !Commands.registerCommand(this, cmd) ) {
            console.log(`: unable to initialize command ${cmd.identifier}`)            
        }
        else {
            console.log(`: registered command ${cmd.identifier}`)
        }
    }
}


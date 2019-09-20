import * as Discord from 'discord.js'
import { Store, createStore } from 'redux';

import { storeRoot, BotStore } from '../store/bot-store'
import { actionUserInteracted } from '../store/user-store';
import './bot-commands'
import { Commands } from './bot-commands';
import { MessageSource } from './message-source';
import { isNullOrUndefined, isUndefined } from 'util';
import BotService from './bot-service';
import apiService from '../services/service-api';

import botConfig from '../assets/bot.config.json'
import { resolve } from 'path';

export default class BotClient {
    path: string
    assetPath: string
    token: string = ''
    private client: Discord.Client
    private serviceMap: Map<string, BotService>
    store: Store<BotStore>
    config: object
    
    constructor(path: string, token: string) {
        this.path = path
        this.assetPath = resolve(path, 'assets/')
        this.token = token
        this.client = new Discord.Client()
        this.serviceMap = new Map<string, BotService>()
        this.store = createStore(storeRoot)
        this.config = botConfig
        this.client
        .on('ready', this.onConnectionReady)
        .on('message', this.onMessage)

    }
    
    registerCommand(cmd: Commands.Command) {
        if ( !Commands.registerCommand(this, cmd) ) {
            console.log(`unable to initialize command ${cmd.identifier}`)            
        }
        else {
            console.log(`registered command ${cmd.identifier}`)
        }
    }

    registerService(service: BotService) {
        this.serviceMap.set(service.name, service)
        console.log(`: starting service ${service.name}`)
        service.run(this)
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
        let version = process.env.npm_package_version
        console.log(`: DirtBoi ${version}`)
        console.log(`: connecting`)
        this.client.login(this.token)
        this.registerService(apiService)
    }
}


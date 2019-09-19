import * as Discord from 'discord.js'
import { Store, createStore } from 'redux';

import { storeRoot, BotStore } from '../store/bot-store'
import { actionUserInteracted } from '../store/user-store';
import './bot-commands'
import { Commands } from './bot-commands';
import { MessageSource } from './message-source';
import { isNullOrUndefined } from 'util';

export default class BotClient {
    token: string = ''
    private client: Discord.Client
    store: Store<BotStore>

    
    constructor(token: string) {
        this.token = token
        this.client = new Discord.Client()
        this.store = createStore(storeRoot)
        this.client
        .on('ready', this.onConnectionReady)
        .on('message', this.onMessage)

    }
    
    registerCommand(cmd: Commands.Command) {
        console.log(`registered command ${cmd.identifier}`)
        Commands.registerCommand(cmd)
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
    }
}


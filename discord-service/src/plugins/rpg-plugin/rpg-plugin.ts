import { BotPlugin } from "../../bot/bot-plugin";
import BotClient from "../../bot/bot-client";
import { readFileSync } from "fs";
import path from 'path'
import { isUndefined } from "util";
import { Request, Response } from "express";
import storyCommand from "./story-command";
import apiService, { ApiService } from "../native-plugin/service-api";


const rpgPlugin: BotPlugin = {
    name: 'rpg',
    commands: [],

    initializationCallback: (bot: BotClient) => {
        const api: ApiService | undefined = bot.getService<ApiService>(apiService.name)
        const database = JSON.parse(readFileSync(path.resolve(bot.assetPath, 'rpg/database/database.json')).toString())

        if ( !isUndefined(api)) {
            api.addRoute("story", "database/:class/:name", (req: Request, res: Response) => {
                const assetClass = req.params['class']
                const assetName = req.params['name']

                if ( database[assetClass] ) {
                    if ( database[assetClass][assetName] ) {
                        const fileName = database[assetClass][assetName]
                        const assetPath = path.resolve(bot.assetPath, "rpg/database", assetClass, fileName)
                        console.log(`asset found: ${assetName}: ${assetPath}`)
                        const fileContent = readFileSync(assetPath).toString()
                        res.send(JSON.parse(fileContent))
                    }
                    else {
                        res.send({error: `unknown asset ${assetName}`})
                    }
                } else {
                    res.send({error: `unknown class ${assetClass}`})
                }
            })

            api.addRoute("story", "database/:class", (req: Request, res: Response) => {
                const assetClass = req.params['class']

                if ( database[assetClass] ) {
                    let assets: string[] = []

                    for(let p in database[assetClass]) {
                        assets.push(p)
                    }

                    res.send({assets: assets})

                } else {
                    res.send({error: `unknown class ${assetClass}`})
                }
            })
            
            return true
        }
        return false
    }
}

export default rpgPlugin
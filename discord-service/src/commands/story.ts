import { Commands } from "../bot/bot-commands";
import BotClient from "../bot/bot-client";
import apiService, { ApiService } from "../services/service-api";
import { isUndefined } from "util";
import path from 'path'
import { readFileSync } from "fs";
import { Response, Request } from "express-serve-static-core";

const storyCommand: Commands.Command = {
    identifier: 'story',
    invoke: () => {
        console.log(`story invoked`)
    },

    serviceSetup: (bot: BotClient) => {
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

export default storyCommand
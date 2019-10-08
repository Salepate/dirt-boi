import BotService from "../../../bot/bot-service";
import BotClient from "../../../bot/bot-client";
import apiService, { ApiService } from "./service-api";
import { Commands, CommandAlias } from "../../../bot/bot-commands";

const backendService: BotService = {
    name: 'dirt-boi-backend',
    run: (bot: BotClient) => {
        const api = bot.getService<ApiService>(apiService.name)

        if ( api ) {
            api.addRoute('bot', 'commands/get', (req, res) => {
                res.send(Commands.getCommands(CommandAlias.Long))
            })
    
            api.addRoute('bot', 'api/routes/get', (req, res) => {
                res.send(api.getRoutes())
            })
        }

        return !!api // hax
    },
    service: undefined
}

export default backendService
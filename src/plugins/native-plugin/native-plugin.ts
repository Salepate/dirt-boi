import { BotPlugin, BotCommand } from "../../bot/bot-plugin";
import backendService from "./services/backend-service";
import apiService from "./services/service-api";
import * as nativeCommands from './commands'
import { createArrayFromModule } from "../../bot/helpers/command-helpers";

const nativePlugin: BotPlugin = {
    name: "native",
    commands: createArrayFromModule<BotCommand>(nativeCommands),
    services: [apiService, backendService],
    version: "1.0.2"
}

export default nativePlugin
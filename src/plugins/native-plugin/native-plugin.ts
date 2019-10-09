import { BotPlugin } from "../../bot/bot-plugin";
import versionCommand from "./commands/version-command";
import commandsCommand from "./commands/commands-command";
import apiService from "./services/service-api";
import commandCommand from "./commands/command-command";
import backendService from "./services/backend-service";
import helpCommand from "./commands/help-commands";

const BotNative: BotPlugin = {
    name: "native",
    commands: [versionCommand, helpCommand, commandsCommand, commandCommand],
    services: [apiService, backendService],
    version: "1.0.2"
}

export default BotNative
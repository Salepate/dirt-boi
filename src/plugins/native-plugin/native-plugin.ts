import { BotPlugin } from "../../bot/bot-plugin";
import versionCommand from "./commands/version-command";
import commandsCommand from "./commands/commands-command";
import apiService from "./services/service-api";
import commandCommand from "./commands/command-command";
import backendService from "./services/backend-service";

const BotNative: BotPlugin = {
    name: "native",
    commands: [versionCommand, commandsCommand, commandCommand],
    services: [apiService, backendService]
}

export default BotNative
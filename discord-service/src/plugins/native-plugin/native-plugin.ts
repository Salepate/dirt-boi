import { BotPlugin } from "../../bot/bot-plugin";
import versionCommand from "./commands/version-command";
import commandsCommand from "./commands/commands-command";
import apiService from "./services/service-api";

const BotNative: BotPlugin = {
    name: "native",
    commands: [versionCommand, commandsCommand],
    services: [apiService]
}

export default BotNative
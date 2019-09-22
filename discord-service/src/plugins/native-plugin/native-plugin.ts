import { BotPlugin } from "../../bot/bot-plugin";
import versionCommand from "./version-command";
import commandsCommand from "./commands-command";
import apiService from "./service-api";

const BotNative: BotPlugin = {
    name: "native",
    commands: [versionCommand, commandsCommand],
    services: [apiService]
}

export default BotNative
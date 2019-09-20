import { BotPlugin } from "../../bot/bot-plugin";
import apiService from "../../services/service-api";
import versionCommand from "./version-command";
import commandsCommand from "./commands-command";

const BotNative: BotPlugin = {
    name: "native",
    commands: [versionCommand, commandsCommand],
    services: [apiService]
}

export default BotNative
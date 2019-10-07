import { RichEmbed } from "discord.js";

export const versionEmbed = (product: string, version: string, label: string = '') => {
    return new RichEmbed({
        title: `${product} - v${version}`,
        description: label,
        color: label === 'dev' ? 0xcc2222 : 0x81df53
    })
}
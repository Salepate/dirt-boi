const snowFlakeRegex = /\<@[0-9]{6,}\>/g

export const isSnowflake = (word: string) => {
    return word.match(snowFlakeRegex)
}

export const getIdFromFlake = (flake: string) => {
    return flake.substr(2, flake.length - 3)
}
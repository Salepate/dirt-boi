const snowFlakeRegex = /\<@[0-9]{6,}\>/g

export const isSnowflake = (word: string) => {
    return word.match(snowFlakeRegex)
}

export const getIdFromFlake = (flake: string) => {
    return flake.substr(2, flake.length - 3)
}

export const createArrayFromModule = <T>(obj: any): T[] => {
    const res: T[] = []

    for(let p in obj) {
        res.push(obj[p])
    }

    return res
}
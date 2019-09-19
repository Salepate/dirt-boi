import { GameCharacter } from "../character/game-character";
import RPG from "../database";


export interface SkillData {
    name: string
    effects: EffectData[]
    description: string
}


export interface EffectData {
    chance: number,
    effectName: string,
    trigger: string,
    value?: number
}

class Skill {
    data: SkillData

    constructor(skillData: SkillData) {
        this.data = skillData
    }


    run = (owner: GameCharacter, target: GameCharacter, log: string[], trigger: string) => {

        let triggered: boolean = false

        let effectLogs: string[] = []

        for(let i = 0; i < this.data.effects.length; ++i) {
            const effect: EffectData = this.data.effects[i]

            if ( effect.trigger != trigger) 
                continue

            const r = Math.random()

            if ( r <= effect.chance ) {
                RPG.effects[effect.effectName].apply(owner, target, effect.value || 0)
                triggered = true
            }
        }

        if ( triggered ) {
            effectLogs.unshift(`${owner.name} used ${this.data.name}!`)
        }

        log.push(...effectLogs)
    }
}

export default Skill
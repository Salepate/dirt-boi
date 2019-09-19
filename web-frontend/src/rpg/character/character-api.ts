import { GameCharacter } from "./game-character";
import { isUndefined, isNullOrUndefined } from "util";
import CharacterClass from "./character-class";
import RPG from "../database";
import Skill from "../skills/skill";

export default {}

export function getScore(gameCharacter: GameCharacter) {
    return gameCharacter.dmg * 2 + gameCharacter.maxHp
}

export function getExperienceFactor(ally: GameCharacter, enemy: GameCharacter) {
    return 1.0
}

export function applyDamage(dmg: number, target: GameCharacter) {
    if ( isUndefined(target.roundDodge) || target.roundDodge-- <= 0 )
        target.hp = Math.max(0, target.hp - dmg)
}

export function applyHeal(heal: number, target: GameCharacter) {
    target.hp = Math.min(target.maxHp, target.hp + heal)
}

export function applySkills(caster: GameCharacter, target: GameCharacter, trigger: string, log: string[]) {
        const characterClass: CharacterClass = RPG.classes[caster.class]
        
        if ( !isNullOrUndefined(characterClass.skills)) {
            for(let i = 0; i < characterClass.skills.length; ++i) {
                let skillName: string =  characterClass.skills[i]
                const skill: Skill = new Skill(RPG.skills[skillName])
                skill.run(caster, target, log, trigger)
            }
    }
}

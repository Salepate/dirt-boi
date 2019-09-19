import { isUndefined, isNullOrUndefined } from "util";
import CharacterClass from "./character-class";
import RPG from "../database";
import Skill from "../skills/skill";

export type GameCharacter = {
    name: string
    hp: number
    maxHp: number
    dmg: number
    class: string
    level: number

    roundDodge?: number
}

export type GameCharacterExperience = {
    experience: number
}
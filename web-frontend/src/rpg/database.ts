import CharacterClass from './character/character-class.js';
import { SkillData } from './skills/skill.js';
// assets

// classes
import adventurer from './assets/classes/adventurer.json'
import warrior from './assets/classes/warrior.json'
import creature from './assets/classes/creature.json'
import ninja from './assets/classes/ninja.json'
// skills
import criticalStrike from './assets/skills/critical-strike.json'
import doubleHit from './assets/skills/double-hit.json'
import dodge from './assets/skills/dodge.json'
import attack from './assets/skills/attack.json'
// mobs
import blob from './assets/enemies/blob.json'
// heroes
import baseHero from './assets/heroes/default.json'

import Effect, { critEffect, dodgeEffect, damageEffect, selfHealEffect } from './skills/effects';
import { GameCharacter } from './character/game-character.js';


interface CollectionMap<T> {
    [name:string]: T
}

interface Database {
    classes: CollectionMap<CharacterClass>
    skills: CollectionMap<SkillData>
    effects: CollectionMap<Effect>
    mobs: CollectionMap<GameCharacter>
    heroes: CollectionMap<GameCharacter>
}

const RPG: Database = {
    classes: {
        'adventurer': adventurer,
        'warrior': warrior,
        'ninja': ninja,
        'creature': creature
    },
    skills: {
        'critical-strike': criticalStrike,
        'double-hit': doubleHit,
        'dodge': dodge,
        'attack': attack
    },
    effects: {
        'damage': damageEffect,
        'crit': critEffect,
        'dodge': dodgeEffect,
        'self-heal': selfHealEffect
    },
    mobs: {
        'blob': blob
    },
    heroes: {
        'default': baseHero
    }
}

export default RPG
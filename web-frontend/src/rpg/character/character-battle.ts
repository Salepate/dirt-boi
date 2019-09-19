import BattleRewards from "../battle/battle-rewards";
import { GameCharacter } from "./game-character";
import { getScore, getExperienceFactor, applySkills, applyDamage } from "./character-api";

export default class CharacterBattle {

    public ally: GameCharacter
    public enemy: GameCharacter


    public battleLog: string[]

    constructor(ally: GameCharacter, enemy: GameCharacter) {
        this.ally = ally
        this.enemy = enemy
        this.battleLog = ['Battle has started']
    }


    public battle = () => {
        while(!this.isOver()) {
            this.singleTurn()
        }
    }

    public singleTurn() {
        if ( this.isOver() )
            return
            
        let rounds: GameCharacter[]

        if ( Math.random() <= 0.5 )
            rounds = [this.ally, this.enemy]
        else
            rounds = [this.enemy, this.ally]

        for(let i = 0; i < rounds.length; ++i) {
            let attacker = rounds[i]
            let target = rounds[(i+1) % rounds.length]

            this.characterTurn(attacker, target)

            if ( this.isOver() )
            {
                if ( this.isDead(this.enemy) ) {
                    this.battleLog.push(`${this.ally.name} has won the battle!`)
                } else if ( this.isDead(this.ally) ) {
                    this.battleLog.push(`${this.ally.name} has lost the battle!`)
                }
                break
            }
        }

        this.ally.roundDodge = 0
        this.enemy.roundDodge = 0
    }

    public getRewards() : BattleRewards {
        return {
            experience: getScore(this.enemy) * getExperienceFactor(this.ally, this.enemy)
        }
    }

    public characterTurn(attacker: GameCharacter, target: GameCharacter) {

        let currentTargetHp = target.hp

        applySkills(target, attacker, 'hurt', this.battleLog)
        applyDamage(attacker.dmg, target)
        applySkills(attacker, target, 'hit', this.battleLog)

        let damageDone = (currentTargetHp - target.hp)

        if ( damageDone > 0 ) {
            this.battleLog.push(`${attacker.name} attacked ${target.name} and did ${damageDone} damage!`)
        }
    }

    public isOver = () : boolean => {
        return this.isDead(this.ally) || this.isDead(this.enemy)
    }


    public isDead = (character: GameCharacter) : boolean  => {
        return character.hp <= 0.0
    }
}

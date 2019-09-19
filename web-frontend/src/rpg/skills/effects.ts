import { GameCharacter } from "../character/game-character";
import { isUndefined } from "util";
import { RatingIcon } from "semantic-ui-react";
import { applyDamage } from "../character/character-api";

export const damageEffect: Effect = {
    apply: (src: GameCharacter, target: GameCharacter, ratio: number) => {
        applyDamage(src.dmg * ratio, target)
    }
}

export const selfHealEffect: Effect = {
    apply: (src, target, value) => {
        applyDamage(-value, src)
    }
}

export const critEffect: Effect = {
    apply: (src: GameCharacter, target: GameCharacter) => {
        applyDamage(Math.max(1, src.dmg * 0.5), target)
    }
}

export const dodgeEffect: Effect = {
    apply: (src: GameCharacter, target: GameCharacter) => {
        src.roundDodge = src.roundDodge || 0
        src.roundDodge++
    }
}

interface Effect {
    apply: (src: GameCharacter, target: GameCharacter, value: number) => void
}

export default Effect



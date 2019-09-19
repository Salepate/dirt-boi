import { Card, Progress, Label, SemanticCOLORS, Icon, Container } from "semantic-ui-react";
import React from "react";
import { GameCharacter } from "../rpg/character/game-character";
import CharacterClass from '../rpg/character/character-class'

// assets
import icon_sword from '../assets/sword_icon.png'
import RPG from "../rpg/database";

export type CharacterCardProps = {
    character: GameCharacter
}


class BattleCard extends React.Component<CharacterCardProps> {
    render() {
        const {name, hp, maxHp, dmg, level} = this.props.character

        let color: SemanticCOLORS = "green"
        if ( hp / maxHp <= 0.5)
            color = "orange"

        let charClass: CharacterClass = RPG.classes[this.props.character.class]

        return <Card>
            <Card.Content>
                <Card.Header>
                    {name}
                </Card.Header>
                <Card.Meta>
                    {charClass.name} Lv. {level}
                </Card.Meta>
            </Card.Content>
            <Card.Content>
                <Progress color={color} size='small' percent={hp/maxHp*100} label={`${hp} hp`}></Progress>
            </Card.Content>
            <Card.Content extra> 
                <Label><Icon name='cut'/> {dmg}</Label>
                <Label><Icon name='shield alternate'/> {1}</Label>
            </Card.Content>
        </Card>
    }
}

export default BattleCard
import React from "react";
import { Card, List, Popup, Button, Divider, Container } from "semantic-ui-react";
import CharacterClass from "../rpg/character/character-class";
import { GameCharacter } from "../rpg/character/game-character";
import RPG from "../rpg/database";
import { isNullOrUndefined } from "util";

export type SkillsCardProps = {
    character: GameCharacter
}

export default class SkillsCard extends React.Component<SkillsCardProps> {
    render() {
        const characterClass: CharacterClass = RPG.classes[this.props.character.class]
        const {level} = this.props.character
        let {name, skills} = characterClass

        if ( isNullOrUndefined(skills) )
            skills = []

        
        return <Card>
            <Card.Content>
                <Card.Header>{name} Skills</Card.Header>
                <Card.Meta>Lv. {level}</Card.Meta>
            </Card.Content>
            <Card.Content>
                <List>
                    {skills.map((s,i) => {
                        let x = <>
                            {RPG.skills[s].description}
                            <Divider/>
                            Chance: {RPG.skills[s].effects[0].chance*100}%
                        </>

                        return <List.Item key={i}>
                            <Popup content={x} trigger={<List.Item>{RPG.skills[s].name}</List.Item>}></Popup>
                            </List.Item>
                    })}
                </List>
            </Card.Content>
        </Card>
    }

}
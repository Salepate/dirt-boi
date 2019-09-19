import React from 'react'
import { Tab, Container } from 'semantic-ui-react';
import { GameCharacter } from '../rpg/character/game-character';
import BattleCard from './battle-card';
import SkillsCard from './skills-card';


export type CharacterCardsProps = {
    gameCharacter: GameCharacter

}

export default class CharacterCards extends React.Component<CharacterCardsProps> {
    render() {
        const {gameCharacter} = this.props

        return (<Container>
                    <Tab menu={{
                    secondary: true
                }} panes={[
                    {
                        menuItem: 'Character',
                        render: () => <BattleCard character={gameCharacter}/>
                    },
                    {
                        menuItem: 'Skills',
                        render: () => <SkillsCard character={gameCharacter}/>
                    }                                
                ]} />
            </Container>
        )
    }
}
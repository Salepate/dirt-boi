import React from "react";

import {Button, ButtonGroup, Grid, Message, Tab, Segment} from 'semantic-ui-react'

import blob_json from '../rpg/assets/enemies/blob.json'
import BattleCard from "./battle-card";

import { GameCharacter } from "../rpg/character/game-character";
import CharacterBattle from "../rpg/character/character-battle";
import { isNull } from "util";
import SkillsCard from "./skills-card";
import CharacterCards from "./character-cards";
import { connect } from "react-redux";
import GameStore from "../redux/game-store.js";


const blob = blob_json as GameCharacter

let hero: GameCharacter = {
    name: 'John',
    dmg: 2,
    hp: 10,
    maxHp: 10,
    class: 'ninja',
    level: 5
}

export type BattleState = {
    battle: CharacterBattle | null
    ally: GameCharacter
    enemy: GameCharacter
}

type BattleScreenOwnProps = {
    playerCharacter: GameCharacter
}

class BattleScreenUI extends React.Component<BattleScreenOwnProps, BattleState> {
    constructor(props: any) {
        super(props)

        let ally = {...hero}
        let enemy = {...blob}

        this.state = {
            ally: ally,
            enemy: enemy,
            battle: null
        }
    }

    render() {
        const {playerCharacter} = this.props
        const {enemy, battle} = this.state

        let log: string[]

        if ( !isNull(battle))
            log = [...battle.battleLog].reverse()
        else
            log = []


 
        return <Grid centered columns={2}>
                <Grid.Row centered columns={5}>
                    <Grid.Column>
                        <CharacterCards gameCharacter={playerCharacter}/>
                    </Grid.Column>
                    <Grid.Column>
                        <CharacterCards gameCharacter={enemy}/>
                    </Grid.Column>                
                </Grid.Row>

                <Grid.Row centered columns={3}>
                    <Grid.Column textAlign='center'>
                    <ButtonGroup>
                        <Button primary onClick={this.launchBattle}>Auto</Button>
                        <Button secondary onClick={this.advanceTurn}>Attack</Button>
                    </ButtonGroup>                        
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row centered columns={2}>
                    <Grid.Column>
                        <Message>
                            <Message.List>
                            {log.map((l,i) => {
                                return (<Message.Item key={i}>{l}</Message.Item>)
                            })}
                            </Message.List>     
                        </Message>
                    </Grid.Column>
                </Grid.Row>
        </Grid>
    }


    advanceTurn = () => {
        let battle = this.state.battle || new CharacterBattle(this.props.playerCharacter, this.state.enemy)
        battle.singleTurn()
        this.setState({
            ally: battle.ally,
            enemy: battle.enemy,
            battle: battle
        })
    }
    
    launchBattle = () => {
        let battle = this.state.battle || new CharacterBattle(this.props.playerCharacter, this.state.enemy)
        battle.battle()
        this.setState({ally: battle.ally, enemy: battle.enemy, battle:battle})
    }
}

const mapDispatchToProps = (state: GameStore): BattleScreenOwnProps => {
    return {
        playerCharacter: state.gameState.gameCharacter
    }
}

const BattleScreen = connect(mapDispatchToProps)(BattleScreenUI)

export default BattleScreen
import React from 'react'
import { GameCharacter } from '../rpg/character/game-character';
import { isNull } from 'util';
import RPG from '../rpg/database';
import BattleScreen from './battle-screen';
import { ButtonGroup, Divider, Button, Container } from 'semantic-ui-react';
import { GameState, actionUpdateGameCharacter as actionUpdateGameCharacter } from '../redux/game-state-reducer';
import GameStore from '../redux/game-store';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import HubScreen from './hub-screen';

const KEY_CHARACTER: string = 'charkey'

type MainGameOwnProps = {
    gameChar: GameCharacter
}

type MainGameDispatchProps = {
    updateChar: (gameChar: GameCharacter) => void
}

type AllProps = MainGameOwnProps & MainGameDispatchProps

type MainGameState = {
    gameChar: GameCharacter
}

class MainGameUI extends React.Component<AllProps, MainGameState> {
    
    constructor(props: AllProps) {
        super(props)

    }

    componentDidMount() {
        this.loadGame()
    }

    render() {
        return (
        <BrowserRouter>
            <Divider/>
            <Container style={{height: 800, overflow: 'hidden'}}>
                <Route component={BattleScreen} path="/battle" />
                <Route component={HubScreen} path="/hub" />
            </Container>
            <Divider/>
            <Container textAlign='center'>
                <Button as={Link} primary to='/hub'>Town</Button>
                <Button as={Link} primary to='/battle'>Battle</Button>
                <Button onClick={this.saveGame} >Save</Button>
                <Button onClick={this.clearGame} secondary>Clear</Button>
            </Container>
        </BrowserRouter>)
    }

    loadGame = () => {
        let charData = localStorage.getItem(KEY_CHARACTER)
        let char: GameCharacter

        if ( !isNull(charData))
        {
            char = JSON.parse(charData)
        }
        else {
            char = RPG.heroes['default']
        }

        this.props.updateChar(char)
    }

    saveGame = () => {
        let charData = JSON.stringify(this.props.gameChar)
        localStorage.setItem(KEY_CHARACTER, charData)
    }

    clearGame = () => {
        localStorage.clear()
    }
}

const mapStateToProps = (state: GameStore): MainGameOwnProps => {
    return {
        gameChar: state.gameState.gameCharacter
    }
}

const mapDispatchToProps = (dispatch: any): MainGameDispatchProps => {
    return {
        updateChar: (gameChar: GameCharacter) => { dispatch(actionUpdateGameCharacter(gameChar))}
    }
}

const MainGame = connect(mapStateToProps, mapDispatchToProps)(MainGameUI)

export default MainGame
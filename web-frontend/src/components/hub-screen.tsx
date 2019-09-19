
import React from 'react'
import { Grid, CardContent, CardHeader, Card, ButtonGroup, Button, Menu } from 'semantic-ui-react';
import CharacterCards from './character-cards';
import { GameCharacter } from '../rpg/character/game-character';
import GameStore from '../redux/game-store';
import { connect } from 'react-redux';
import { actionUpdateGameCharacter } from '../redux/game-state-reducer';
import { Link } from 'react-router-dom';
import { applyHeal } from '../rpg/character/character-api';

type HubScreenOwnProps = {
    gameChar: GameCharacter
}

type HubScreenDispatchProps = {
    updateChar: (gameChar: GameCharacter) => void
}

class HubScreenUI extends React.Component<HubScreenOwnProps & HubScreenDispatchProps> {
    render() {
        const {gameChar} = this.props

        return (
        <Grid centered columns={2}>
            <Grid.Column>
                <Card>
                    <CardContent>
                        <CardHeader>Inn</CardHeader>
                    </CardContent>
                    <CardContent>
                        <ButtonGroup>
                            <Button primary onClick={this.rest}>Rest</Button>
                        </ButtonGroup>
                    </CardContent>
                </Card>
            </Grid.Column>
            <Grid.Column>
                <CharacterCards gameCharacter={gameChar}/>
            </Grid.Column>
        </Grid>
        )
    }

    rest = () => {
        let char = {...this.props.gameChar}
        applyHeal(char.maxHp, char)
        this.props.updateChar(char)
    }
}

const mapStateToProps = (state: GameStore): HubScreenOwnProps => {
    return {
        gameChar: state.gameState.gameCharacter
    }
}

const mapDispatchToProps = (dispatch: any): HubScreenDispatchProps => {
    return {
        updateChar: (gameChar) => { dispatch(actionUpdateGameCharacter(gameChar))}
    }
}

const HubScreen = connect(mapStateToProps, mapDispatchToProps)(HubScreenUI)

export default HubScreen
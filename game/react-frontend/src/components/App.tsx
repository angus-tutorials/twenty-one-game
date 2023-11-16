import React, { Component } from 'react'
import '../styles/App.css';
import 'bulma/css/bulma.min.css';
import Setup from './Setup';
import Board from "./Board";



interface AppState{
    show_board: boolean
    player_count: number
}

class App extends Component<any, AppState> {
    /**
     * The App is the entry point,
     * it contains headers, footers etc
     * and will control the flow of the program
     */

    constructor(props: any) {
        super(props)

        this.state = {
            show_board: false,
            player_count: 0
        }

        // Bindings
        this.startGame = this.startGame.bind(this);
    }

    startGame(number_of_players: number){
        /**
         * This function is called from the Setup
         * class and loads the board component
         */
        this.setState({player_count: number_of_players, show_board: true})
    }


    render(){
        return (
            <section className="hero is-fullheight has-background-dark">
                <div className="hero-head">
                    <header className="navbar p-2">
                        <div className="container">
                            <div className="has-text-centered has-text-left-tablet">
                                <h1 className="title has-text-light">21 Game</h1>
                            </div>
                        </div>
                    </header>
                </div>

                <div className="hero-body">

                    {this.state.show_board
                        ? <Board player_count={this.state.player_count} />
                        : <Setup startFunc={this.startGame} />
                    }

                </div>

                <div className="hero-foot">
                    <footer className="footer has-background-grey-dark">
                        <div className="content has-text-centered has-text-light">
                            <p>
                                Made by SDX
                            </p>
                        </div>
                    </footer>
                </div>
            </section>
        );
    }
}

export default App;

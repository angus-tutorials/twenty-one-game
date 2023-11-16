import React, { Component } from 'react'


interface SetupState {
    player_count: number
}

class Setup extends Component <any, SetupState>{
    /**
     * The Setup is where the user
     * sets up the game before
     * they start playing
     */

    private readonly min_players: number;
    private readonly max_players: number;

    constructor(props: any) {
        super(props);
        this.min_players = 2
        this.max_players = 15

        // Store state
        this.state ={
            player_count: this.min_players
        }
    }

    private updatePlayerCount(value: number = this.min_players){
        /**
         * Update the state of the number
         * of players
         */

        // Check the value is not NULL

        if (value >= this.min_players && value <= this.max_players){
            this.setState({player_count: value})
        }
        else if(value > this.max_players){
            this.setState({player_count: this.max_players})
        }else {
            this.setState({player_count: this.min_players})
        }
    }


    playerCountButtonClicked(increment=true){
        /**
         * When the user clicks either
         * the + or - buttons
         */

        this.updatePlayerCount(increment ? this.state.player_count + 1: this.state.player_count -1)
    }


    // Render the View
    render() {
        return (
            <div className="container mx-auto">
                {/* Player count picker */}

                <div className="columns is-centered">
                    <div className="column is-6 is-4-desktop has-text-centered">
                        <div className="card">
                            <header className="has-text-centered py-4">
                                <p>
                                    Please select the number of players
                                </p>
                            </header>
                            <div className="card-content">
                                <div className="level is-mobile">
                                    {/* Left button */}
                                    <div className="level-item">
                                        <button className="button is-large" onClick={() => this.playerCountButtonClicked(false)}>
                                    <span className="icon">
                                       <i className="fas fa-minus"/>
                                    </span>
                                        </button>
                                    </div>
                                    {/* Input */}
                                    <div className="level-item">
                                        <p className="title">{this.state.player_count}</p>
                                    </div>



                                    {/* Right button */}
                                    <div className="level-item">
                                        <button className="button is-large" onClick={() => this.playerCountButtonClicked()} >
                                    <span className="icon">
                                       <i className="fas fa-plus"/>
                                    </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <footer className="card-footer">
                                <p className="card-footer-item">
                                    <button onClick={() => this.props.startFunc(this.state.player_count)} className="button is-rounded is-primary ">Start Game</button>
                                </p>
                            </footer>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Setup;

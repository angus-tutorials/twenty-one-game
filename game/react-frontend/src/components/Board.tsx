
import React, {Component} from 'react'
import PlayerView from "./PlayerView";
import Player from "../models/Player";


type RoundReturn = {
    /**
     * Defines a return
     * type for each round
     */
    remaining_players: Array<Player>,
    player_index: number
}


interface BState {
    /**
     * Defines the state
     * for this board
     */

    players: Array<Player>
    current_number: number
    game_running: boolean
    board_loading: boolean
}

interface BProps {
    /**
     * Defines the properties
     * for the board
     */

    player_count: number
}


const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

/**
 * The Board is where the game is played
 * it contains the player images and the button
 * bar to start the game etc, it controls the gameplay
 */
class Board extends Component<BProps, BState>  {
    private readonly ending_number: number;
    private readonly turn_interval: number;

    constructor(props: BProps) {
        super(props);

        this.ending_number = 21;
        this.turn_interval = 1000;

        this.state = {
            players: [],
            current_number: 0,
            game_running: false,
            board_loading: true
        };
    }


    componentDidMount(){
        /**
         * Called when the component
         * is rendered
         */

        // Fetch the players from the server
        this.fetchPlayers(this.props.player_count).then(()=> {this.setState({board_loading: false})})

    }


    async fetchPlayers(number_of_players_to_fetch: number) {
        /**
         * Load the players names
         * as an array from the server,
         * the response should be JSON with key "names"
         */
        try {
            const response = await fetch(`/load?players=${number_of_players_to_fetch}`);
            const json = await response.json();
            // Check json gives a valid response
            if (json.names){
                // Instead of pushing to the array we replace the whole thing
                let my_array: Array<Player> = []
                json.names.map( (name: string, index: number) => my_array.push({name: name, id:index, alive:true}));
                this.setState({players: my_array})
            }

        } catch (error) {
            console.log(error);
        }
    }


    async getPlayerMoves(player: Player, player_count: number, current_number: number): Promise<Array<number>>
    {
        /**
         * Call our server endpoint to fetch
         * the moves for this player
         */


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: current_number, playerCount: player_count, name: player.name })
        };

        try {
            const response = await fetch('/play', requestOptions);
            const json = await response.json();
            if (json.scoreList){
                return json.scoreList
            }

        } catch (error) {
            console.log(error);
        }
        return [current_number]
    }

    async startRound(players:Array<Player>, start_index:number): Promise<RoundReturn>
    {
        /**
         * Start a round of the game, this round
         * will end when the number hits 21 or above
         * @param start_index: The index in the player array to begin this round
         */

        let current_number: number = 0
        let current_player_index: number = start_index
        let current_player: Player = players[current_player_index]

        // Loop until 21 AND check one of the final players isn't cheating
        while (current_number < this.ending_number && players.length > 1) {
            current_player = players[current_player_index]

            // Fetch next move
            let moves: Array<number> =  await this.getPlayerMoves(current_player, players.length, current_number).then(function (promise: Array<number>)
                {
                    return promise
                }
            )


            // Update the player's moves on screen
            current_player.moves = moves
            current_player.current = true
            this.updatePlayer(current_player)

            // Sleep to display to user, then reset player
            await sleep(this.turn_interval).then(() => {

                // Perform anti cheat
                if (!this.antiCheat(moves, current_number)){

                    // This player has cheated and must be punished
                    current_player.cheating = true
                    current_player.alive = false

                    // Remove this player from the round
                    players = players.filter(function (player: Player) {
                        return player.id !== current_player.id
                    })

                    // If we remove someone from players we need to adjust the current player index accordingly
                    current_player_index = current_player_index >= players.length ? 0 : (current_player_index)

                }else{

                    current_player.cheating=false

                    // Update the new current number
                    current_number = moves[moves.length-1]

                    // The index of the next player is the next one in the array, if we overflow set to 0
                    current_player_index = current_player_index + 1 >= players.length ? 0 : (current_player_index + 1)
                }

                current_player.moves = []
                current_player.current = false
                this.updatePlayer(current_player)
            });


        }

        // Kill this player
        current_player.alive = false
        this.updatePlayer(current_player)

        // Create a new array with the remaining players
        let remaining_players: Array<Player> = players.filter(function (player: Player) {
            return player.id !== current_player.id
        })

        return {remaining_players: remaining_players, player_index: current_player_index <= 0 ? 0 :current_player_index - 1}


    }

    antiCheat(player_moves: Array<number>, current_number: number): boolean{
        /**
         * Check the player has not cheated
         * by returning an invalid set of numbers, define
         * any rules in here for cheating
         *
         * Will return True if play is valid
         */
        // TODO check consecutive increments of 1
        let last_number =  player_moves[player_moves.length-1]
        return (last_number > current_number && last_number <= current_number + 3)
    }

    updatePlayer(player: Player)
    {
        /**
         * Update this player
         * in the state array
         * to update the UI
         */

        // 1. Make a shallow copy of the items
        let players = [...this.state.players];
        // 2. Find the index of the player to replace
        let index = players.findIndex(p => p.id === player.id );
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        players[index] = player;
        // 5. Set the state to our new copy
        this.setState({players: players});


    }

    async startGame() {
        /**
         * Start the game, once the game
         * is running it cannot be started
         * again until it finishes
         */
        if(!this.state.game_running){
            this.setState({game_running: true})

            let game_players = this.state.players
            let player_index = 0

            // Rest all the players on the board
            game_players.map(function(player: Player){
                player.alive = true
                player.won = false
                player.current = false
                return player
            })

            game_players.forEach(player => this.updatePlayer(player))

            // Keep running until 1 player remains
            while (game_players.length > 1){
                const game_return: RoundReturn = await this.startRound(game_players, player_index)
                game_players = game_return.remaining_players
                player_index = game_return.player_index

            }

            // Display the winner
            const winner: Player = game_players[0]
            winner.won = true
            this.updatePlayer(winner)

            this.setState({game_running: false})

        }

    }


    hasPlayers(min: boolean = false): boolean{
        /**
         * Do we have any players loaded?
         * if min is specified we check for the minimum
         * number to have a game (2)
         */

        if (min){
           return (this.state.players && this.state.players.length > 1)
        }else{
            return (this.state.players && this.state.players.length > 0)
        }

    }


    render() {
        return (
            <div className="container mx-auto">
                {this.state.board_loading
                    ? <div className="column is-4-desktop mx-auto has-text-centered">
                        <p className="has-text-light">Loading players</p>
                        <div className="loader mt-4 mx-auto"/>

                    </div>
                    : <>
                        {this.hasPlayers()
                            ? <>
                                <div className="my-5">
                                    <a href="/" className="button is-link is-light is-rounded">Back</a>
                                </div>

                                <div className="columns is-centered is-multiline">

                                    { this.state.players.map((player: Player) =>{ return <PlayerView key={player.id} player={player} /> }) }

                                </div>
                                <section className="section">
                                    <div className="has-text-centered">
                                        <button disabled={!(this.hasPlayers(true) && !this.state.game_running)} onClick={()=> this.startGame()} className="button is-large is-rounded is-primary">Play</button>
                                    </div>
                                </section>
                            </>
                            : <>
                                <div className="column is-4-desktop mx-auto">
                                    <article className="message is-danger">
                                        <div className="message-header">
                                            <p>Server Error</p>
                                        </div>
                                        <div className="message-body has-text-centered">
                                            <div>No players could be fetched from the server, please try again later</div>
                                            <div className="mt-4"><a href="/" className="button is-white">Back</a></div>
                                        </div>
                                    </article>
                                </div>
                            </>

                        }
                    </>

                }
            </div>
        )
    }
}

export default Board;

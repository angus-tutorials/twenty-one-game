import React, { Component } from 'react'
import Player from "../models/Player";
import player_png from '../assets/player.png';
import player_dead_png from '../assets/player_dead.png';
import player_won_png from '../assets/player_winner.png';
import player_cheating_png from '../assets/player_cheating.png';



interface PlayerViewProps{
    /**
     * Defines the properties
     * a player can take
     */
    player: Player

}

/**
 * The PlayerView is responsible
 * for displaying a player
 * on the screen
 */
class PlayerView extends Component<PlayerViewProps, any>{

    displayMoves()
    {
        let moves: Array<number> = this.props.player.moves || []
        return moves.toString()

    }

    getImage()
    {
        if (this.props.player.alive){
            return this.props.player.won ? player_won_png : player_png
        }else{
            return this.props.player.cheating ? player_cheating_png : player_dead_png
        }
    }

    render(){
        return (
            <div className={"column is-4 is-3-desktop is-2-widescreen"}>
                <div className="card h-100 is-flex is-flex-direction-column">
                    <div className="card-image">
                        <figure className="image is-4by5">
                            <img alt="Player image" src={this.getImage()}/>
                        </figure>
                    </div>
                    <div className="card-content is-flex-grow-1 is-flex is-flex-direction-column has-text-centered">

                        {this.props.player.alive
                            ? <>
                                <div className="media is-flex-grow-1">
                                    <div className="media-content">
                                        <p className={"title is-4 " + (this.props.player.current ? 'has-text-success' : '') }>{this.props.player.name}</p>
                                    </div>
                                </div>

                                <div className="content" style={{height: "2em"}}>
                                    {this.displayMoves()}
                                </div>
                            </>
                            : <>
                                <div className="media is-flex-grow-1">
                                    <div className="media-content">
                                        <p className={"title is-4 has-text-danger-dark"}>{this.props.player.name}</p>
                                    </div>
                                </div>

                                {this.props.player.cheating
                                    ?
                                    <div className="content" style={{height: "2em"}}>
                                        This player cheated!
                                    </div>
                                    : <></>

                                }

                            </>
                        }

                    </div>
                </div>
            </div>
        );
    }

}

export default PlayerView
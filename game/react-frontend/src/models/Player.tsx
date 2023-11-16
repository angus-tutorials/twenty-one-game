
/**
 * The Player model
 * is a class that represents
 * the structure of a player
 */

type Player = {
    name: string,
    id: number,
    alive?: boolean,
    current?: boolean,
    moves?: Array<number>,
    won?: boolean,
    cheating?: boolean
}

export default Player;

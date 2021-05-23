import { Node } from "cc"

export enum CoinColor {
    RED,
    BLUE,
    BLANK,
}
export enum GameAction {
    ADD_COIN,
    SET_COIN,
    NEW_GAME,
    SET_TRUN,
    SWITCH_COLOR,
}
export interface BoardItem {
    coin_color: CoinColor
    node: Node
}
export interface GameState {
    board: Array<BoardItem[]>
    player
    waitingPlayer
    turn_is: CoinColor
}

export interface Action {
    type: GameAction
    data: any
}

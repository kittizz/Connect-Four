export enum CoinColor {
    RED,
    BLUE,
    BLANK,
}
export enum GameAction {
    ADD_COIN,
    SET_COIN,
    NEW_GAME,
}

export interface GameState {
    winner
    board: Array<CoinColor[]>
    player
    waitingPlayer
}

export interface Action {
    type: GameAction
    data: any
}

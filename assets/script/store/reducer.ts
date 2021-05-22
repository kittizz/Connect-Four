import { GameState, Action, GameAction, CoinColor } from "../entity/GameType"

export const reducer = (state: GameState, action: Action) => {
    switch (action.type) {
        case GameAction.ADD_COIN:
            state.board[action.data[0]][action.data[1]] = action.data[2]
            return state

        case GameAction.SET_COIN:
            return { ...state, board: action.data }

        case GameAction.NEW_GAME:
            return {
                ...state,
                //set null all
                board: state.board.map((e) => e.map(() => CoinColor.BLANK)),
            }

        default:
            console.log("[unknown GameAction type]")
            return state
    }
}

import {
    GameState,
    Action,
    GameAction,
    CoinColor,
    BoardItem,
} from "../entity/GameType"
import { SwitchColor } from "../utils"
import { log } from "cc"
export const reducer = (state: GameState, action: Action): GameState => {
    log("[Reducer]", action)
    switch (action.type) {
        case GameAction.ADD_COIN:
            let bItem: BoardItem = action.data[2]
            state.board[action.data[0]][action.data[1]] = bItem
            return state

        case GameAction.SET_COIN:
            return { ...state, board: action.data }

        case GameAction.NEW_GAME:
            return {
                ...state,
                //set null all
                board: state.board.map((e) =>
                    e.map(
                        () =>
                            <BoardItem>{
                                coin_color: CoinColor.BLANK,
                                node: null,
                            }
                    )
                ),
            }
        case GameAction.SET_TRUN:
            return {
                ...state,
                turn_is: action.data,
            }
        case GameAction.SWITCH_COLOR:
            return {
                ...state,
                turn_is: SwitchColor(state.turn_is),
            }
        default:
            log("[Reducer] unknown GameAction type")
            return state
    }
}

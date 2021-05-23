import {
    _decorator,
    Component,
    Prefab,
    director,
    Node,
    Scene,
    Animation,
    AnimationClip,
    instantiate,
    SpriteAtlas,
} from "cc"
import flowAnimToY from "./animationClip/flowAnimToY"
import { Pointer } from "./entity/EventType"
import { BoardItem, CoinColor, GameAction, GameState } from "./entity/GameType"
import { PointerTrigger } from "./PointerTrigger"
import store from "./store"
import { GetColCanDrop } from "./utils"
const { ccclass, property } = _decorator

@ccclass("BoardGame")
export class BoardGame extends Component {
    coinDistance = 98

    @property({ type: Prefab })
    coinRED: Prefab = null

    @property(Prefab)
    coinBLUE: Prefab = null!

    @property(AnimationClip)
    flowAnim: AnimationClip = null!

    nodeCoinsContainer: Scene
    nodeTurnBlue: Scene
    nodeTurnRed: Scene

    start() {
        this.nodeCoinsContainer = director
            .getScene()
            .getChildByPath("Canvas/bg/Game/CoinsContainer")
        this.nodeTurnRed = director
            .getScene()
            .getChildByPath("Canvas/bg/turn/turn-red")
        this.nodeTurnBlue = director
            .getScene()
            .getChildByPath("Canvas/bg/turn/turn-blue")

        // this.node.on(Node.EventType.TOUCH_END, this.drawGame, this)
        director.getScene().on(Pointer.Select_COL, this.onSelectCoin, this)
        store.subscribe(() => {
            let gState = store.getState()
            console.log(gState)
            this.turnBtnShow()
        })
        store.dispatch({ type: GameAction.SET_TRUN, data: CoinColor.RED })
        this.renderBoard()
    }

    onDestroy() {
        // this.node.off(Node.EventType.MOUSE_UP, this.drawGame, this)
        director.getScene().off(Pointer.Select_COL, this.onSelectCoin)
    }
    private turnBtnShow() {
        let gState = store.getState()

        switch (gState.turn_is) {
            case CoinColor.RED:
                this.nodeTurnRed.active = true
                this.nodeTurnBlue.active = false
                break
            case CoinColor.BLUE:
                this.nodeTurnRed.active = false
                this.nodeTurnBlue.active = true
                break
            default:
                this.nodeTurnRed.active = false
                this.nodeTurnBlue.active = false
                break
        }
    }
    newGame() {
        this.nodeCoinsContainer.destroyAllChildren()
        store.dispatch({ type: GameAction.NEW_GAME })
    }
    renderBoard() {
        let gState: GameState = store.getState()
        gState.board.forEach((row, rowIndex) => {
            row.forEach((coin, colIndex) => {
                if (
                    gState.board[rowIndex][colIndex].coin_color ===
                    CoinColor.BLANK
                )
                    return
                this.addCoin(coin, rowIndex, colIndex, false)
            })
        })
    }
    private onSelectCoin($: PointerTrigger) {
        let col = $.Col // 0-6 7 แถวแนวตั้ง

        let gState: GameState = store.getState()
        let row = GetColCanDrop(gState.board, col)[0]

        if (
            gState.board.filter((e) => e[col].coin_color === CoinColor.BLANK)
                .length === 0
        )
            return

        let coin = gState.turn_is
        // this.addCoin(coin, row, col)

        store.dispatch({ type: GameAction.SWITCH_COLOR })
        this.addCoin(<BoardItem>{ coin_color: coin }, row, col, true)
    }
    private addCoin(
        bItem: BoardItem,
        row: number,
        column: number,
        animation: boolean = true
    ) {
        let node: Node
        switch (bItem.coin_color) {
            case CoinColor.RED:
                node = instantiate(this.coinRED)
                break
            case CoinColor.BLUE:
                node = instantiate(this.coinBLUE)
                break
            default:
                return
        }
        this.nodeCoinsContainer.addChild(node)
        bItem.node = node
        store.dispatch({
            type: GameAction.ADD_COIN,
            data: [row, column, bItem],
        })
        let pos = node.getPosition()
        node.setPosition(
            pos.add3f(this.coinDistance * column, this.coinDistance * row, 0)
        )

        if (animation) {
            let ani = node.getComponent(Animation)
            ani.defaultClip = flowAnimToY(pos.y)
            ani.on(
                Animation.EventType.FINISHED,
                () => {
                    if (this.checkWinner(bItem)) {
                        // if (bItem.coin_color == CoinColor.RED) {
                        //     alert("สีแดงชนะ")
                        // } else {
                        //     alert("สีน้ำเงินชนะ")
                        // }
                    }
                },
                this
            )
            ani.play()
        }
    }
    test() {
        this.checkWinner(<BoardItem>{ coin_color: CoinColor.BLUE })
    }
    private checkWinner(player: BoardItem) {
        let gameWon = false
        let gState: GameState = store.getState()
        let posWin = []
        const board = gState.board.map((row) =>
            row.map((slot: BoardItem) => {
                if (slot.coin_color === player.coin_color) return true
                return false
            })
        )
        for (let x1 = 0; x1 < board.length; x1++) {
            for (let y1 = 0; y1 < board[x1].length; y1++) {
                if (!board[x1][y1]) continue
                const piece = [x1, y1]
                this.adjacentPieces(board, piece).forEach(([x2, y2]) => {
                    const direction = [x2 - x1, y2 - y1]
                    if (this.fourInARow(board, piece, direction)) {
                        // console.log(piece, "|", x1, y1, "|", x2, y2)
                        gameWon = true
                        posWin.push([x1, y1], [x2, y2])
                    }
                })
            }
        }
        if (gameWon) {
            posWin.forEach(([row, col]) => {
                gState.board[row][col].node
                    .getComponent(Animation)
                    .play("wipwip")
            })
        }

        return gameWon
    }
    private adjacentPieces(board, pos) {
        const [x1, y1] = pos
        const adjacentPieces = []
        for (let x2 = x1 - 1; x2 <= x1 + 1; x2++) {
            for (let y2 = y1 - 1; y2 <= y1 + 1; y2++) {
                if (
                    (x2 === x1 && y2 === y1) ||
                    x2 < 0 ||
                    x2 > 5 ||
                    y2 < 0 ||
                    y2 > 6
                )
                    continue
                if (board[x2][y2]) adjacentPieces.push([x2, y2])
            }
        }
        return adjacentPieces
    }
    private fourInARow(board, piece, direction) {
        let [x, y] = piece
        const [dx, dy] = direction
        if (
            x + 3 * dx < 0 ||
            x + 3 * dx > 5 ||
            y + 3 * dy < 0 ||
            y + 3 * dy > 6
        )
            return false
        return (
            board[x + dx][y + dy] &&
            board[x + 2 * dx][y + 2 * dy] &&
            board[x + 3 * dx][y + 3 * dy]
        )
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */

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
} from "cc"
import flowAnimToY from "./animationClip/flowAnimToY"
import { Pointer } from "./entity/EventType"
import { CoinColor, GameAction, GameState } from "./entity/GameType"
import { PointerTrigger } from "./PointerTrigger"
import store from "./store"
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

    start() {
        this.nodeCoinsContainer = director
            .getScene()
            .getChildByPath("Canvas/bg/Game/CoinsContainer")
        this.node.on(Node.EventType.TOUCH_END, this.drawGame, this)
        director.getScene().on(Pointer.Select_COL, this.onSelectCoin, this)

        store.subscribe(() => {
            console.log(store.getState())
        })
    }

    onDestroy() {
        this.node.off(Node.EventType.MOUSE_UP, this.drawGame, this)
        director.getScene().off(Pointer.Select_COL, this.onSelectCoin)
    }
    newGame() {
        this.nodeCoinsContainer.destroyAllChildren()
        store.dispatch({ type: GameAction.NEW_GAME })
    }
    drawGame() {
        let x = Math.floor(Math.random() * 7)
        let y = Math.floor(Math.random() * 6)
    }
    private onSelectCoin($: PointerTrigger) {
        let row = Math.floor(Math.random() * 6) // 0-5 6 ขั้นแนวนอน
        let col = $.Col // 0-6 7 แถวแนวตั้ง

        let gameState: GameState = store.getState()

        if (
            gameState.board.filter((e) => e[col] === CoinColor.BLANK).length ===
            0
        )
            return
        if (gameState.board[row][col] !== CoinColor.BLANK) {
            this.onSelectCoin($)
            return
        }

        let coin: CoinColor = Math.floor(Math.random() * 2)
        this.addCoin(coin, row, col)
    }
    private addCoin(
        color: CoinColor,
        row: number,
        column: number,
        animation = true
    ) {
        let node: Node
        switch (color) {
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

        let pos = node.getPosition()
        node.setPosition(
            pos.add3f(this.coinDistance * column, this.coinDistance * row, 0)
        )

        if (animation) {
            let ani = node.addComponent(Animation)
            ani.defaultClip = flowAnimToY(pos.y)
            ani.play()
        }

        store.dispatch({
            type: GameAction.ADD_COIN,
            data: [row, column, color],
        })
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

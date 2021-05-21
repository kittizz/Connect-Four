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

const { ccclass, property } = _decorator

enum CoinColor {
    RED,
    BLUE,
}

@ccclass("BoardGame")
export class BoardGame extends Component {
    coinDistance = 98

    @property({ type: Prefab })
    coinRED: Prefab = null

    @property(Prefab)
    coinBLUE: Prefab = null!

    @property(AnimationClip)
    flowAnim: AnimationClip = null!

    nodeGame: Scene
    zinex = 0
    board: Array<Node[]> = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
    ]

    start() {
        this.node.on(Node.EventType.MOUSE_UP, this.drawGame, this)
        this.nodeGame = director.getScene().getChildByPath("Canvas/bg/Game")
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    drawGame() {
        this.zinex--

        let x = Math.floor(Math.random() * 7)
        let y = Math.floor(Math.random() * 6)

        this.addCoin(CoinColor.RED, x, y)
    }
    private addCoin(color: CoinColor, row: number, column: number) {
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
        this.nodeGame.addChild(node)

        let pos = node.getPosition()

        node.setPosition(
            pos.add3f(this.coinDistance * row, this.coinDistance * column, 0)
        )
        node.setSiblingIndex(-2 + this.zinex)
        let ani = node.addComponent(Animation)
        ani.defaultClip = flowAnimToY(pos.y)
        ani.play()
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

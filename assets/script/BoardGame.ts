import { _decorator, Component, Prefab, director, Vec3, Scene } from "cc"
import store from "./store"

const { ccclass, property } = _decorator

@ccclass("BoardGame")
export class BoardGame extends Component {
    coinDistance = 98

    @property(Prefab)
    coinRED: Prefab = null!

    @property(Prefab)
    coinBLUE: Prefab = null!

    nodeGame: Scene

    start() {
        this.nodeGame = director.getScene().getChildByPath("Canvas/bg/Game")
        this.coinRED.createNode((err, n) => {
            let pos = n.getPosition()

            // n.setPosition(pos.add3f(0, this.coinDistance, 0))
            
            console.log(n.getPosition())

            this.nodeGame.addChild(n)
        })
        this.coinBLUE.createNode((err, n) => {
            this.nodeGame.addChild(n)
        })
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    drawGame() {
        // const $winner = document.getElementById("winner")
        // if (store.getState().winner) {
        //     $winner.classList.add("player" + store.getState().winner)
        //     $winner.classList.remove("hidden")
        //     document.getElementById("turn").classList.add("hidden")
        //     return
        // }
        // $winner.classList.add("hidden")
        // const $board = document.getElementById("board")
        // while ($board.firstChild) $board.removeChild($board.firstChild)
        // store.getState().board.forEach((row) => {
        //     const $row = document.createElement("tr")
        //     row.forEach((piece) => {
        //         // $piece = document.createElement("td")
        //         // if (!piece) $piece.className = "empty"
        //         // else if (piece === 1) $piece.className = "player1"
        //         // else if (piece === 2) $piece.className = "player2"
        //         // $row.appendChild($piece)
        //     })
        //     $board.appendChild($row)
        // })
        // const $player = document.getElementById("player")
        // $player.textContent = "Player " + store.getState().player
        // $player.className = "player" + store.getState().player
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

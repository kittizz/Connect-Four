import { _decorator, Component, Node, Prefab, director, CCInteger } from "cc"
import { Pointer } from "./entity/EventType"
const { ccclass, property } = _decorator

@ccclass("PointerTrigger")
export class PointerTrigger extends Component {
    // [1]
    // dummy = '';

    // [2]
    @property(Prefab)
    pointerRED: Prefab = null

    @property(Prefab)
    pointerBLUE: Prefab = null

    @property(CCInteger)
    Col: number = null

    start() {
        // this.node.on(Node.EventType.MOUSE_UP, this.onTrigger, this)
        this.node.on(Node.EventType.TOUCH_END, this.onTrigger, this)
        // [3]
    }
    onDestroy() {
        // this.node.off(Node.EventType.MOUSE_UP, this.onTrigger, this)
        this.node.off(Node.EventType.TOUCH_END, this.onTrigger, this)
    }
    onTrigger() {
        director.getScene().emit(Pointer.Select_COL, this)
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
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

/**单击，拖动，双指缩放->管理器
 * @Author: zhoualnglang 
 * @Date: 2020-05-28 20:04:34 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-06-02 17:51:45
 */
class EventManger extends BaseClass {
    public static ins(): EventManger {
        return super.ins();
    }

    private _event: {
        target: egret.DisplayObject, thisobj,
        config: { onTapRecognized: Function, onMove: Function, onTap: Function },
        allowSimultaneous, tapMode, touchCount,
        disXY: { x, y }
    }[] = []

    /**移除监听*/
    public removeAll(target: egret.DisplayObject) {
        for (let k = this._event.length - 1; k >= 0; k--) {
            let obj = this._event[k]
            if (obj.target == target) {
                GestureManager.removeAll(obj.target)
                target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this)
                // target.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this)
                target.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this)
                target.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnd, this)
                target.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEnd, this)
                this._event.splice(k, 1)
                return
            }
        }
    }
    /**添加监听 与removeAll成对*/
    public add(target: egret.DisplayObject, thisobj, config: EventObj, allowSimultaneous: boolean = false) {
        this.removeAll(target)
        target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this)
        // target.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this)
        target.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this)
        target.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnd, this)
        target.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEnd, this)

        let event = {
            target: target, thisobj: thisobj, config: config,
            allowSimultaneous: allowSimultaneous,
            tapMode: TapMode.Tap, //点击模式
            touchCount: 0, //点击数
            disXY: { x: 0, y: 0 }
        }
        this._event.push(event)

        let gm_config = {}
        gm_config[GestureType.PINCH] = {}
        gm_config[GestureType.PINCH][GestureState.CHANGED] = this.onTapRecognized.bind(event) //bind->event
        GestureManager.add(target, gm_config, allowSimultaneous);
    }

    private onTapRecognized(e: GestureEvent): void {
        // console.log('this.onTapRecognized:', e, e.currentTarget)
        let event = this as any
        if (event.tapMode == TapMode.Scale) {
            event.config.onTapRecognized(e)
        }
    }

    private onBegin(e: egret.TouchEvent) {
        let event = this.getEvent(e.currentTarget)
        // console.log('this.onBegin:' + event.touchCount, event.tapMode)
        event.touchCount++
        if (event.touchCount == 2) { //表明同时有2个手指点击
            event.tapMode = TapMode.Scale
        }
        event.disXY.x = e.stageX
        event.disXY.y = e.stageY
    }

    private onMove(e: egret.TouchEvent) {
        let event = this.getEvent(e.currentTarget)
        if (event.tapMode == TapMode.Scale) {
            return
        }
        // console.log('this.onMove:' + event.touchCount, event.tapMode)
        event.tapMode = TapMode.Move

        let dx = e.stageX - event.disXY.x
        let dy = e.stageY - event.disXY.y
        event.disXY.x = e.stageX
        event.disXY.y = e.stageY

        let onMove = event.config.onMove
        onMove(dx, dy)
    }

    private onEnd(e: egret.TouchEvent) {
        let event = this.getEvent(e.currentTarget)
        event.touchCount--
        // console.log('this.touchCount:' + event.touchCount, event.tapMode, e.type)
        if (event.touchCount > 0) {
            return
        }
        event.touchCount = 0
        if (event.tapMode == TapMode.Tap) { //单击
            let onTap = event.config.onTap
            onTap(e)
        }
        else {
            event.tapMode = TapMode.Tap
        }
    }

    private getEvent(target: egret.DisplayObject) {
        for (let k in this._event) {
            let obj = this._event[k]
            if (obj.target == target) {
                return obj
            }
        }
    }
}

class EventObj {
    /**缩放回调*/
    onTapRecognized: Function
    /**拖动回调*/
    onMove: Function
    /**单击回调*/
    onTap: Function
    constructor(thisobj, onTapRecognized: Function, onMove: Function, onTap: Function) {
        this.onTapRecognized = onTapRecognized.bind(thisobj)
        this.onMove = onMove.bind(thisobj)
        this.onTap = onTap.bind(thisobj)
    }

}
/**点击模式*/
const enum TapMode {
    Tap = 0, //单击
    Move,  //拖动
    Scale, //缩放
}
window["EventManger"] = EventManger;
window["EventObj"] = EventObj;
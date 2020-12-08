/* 提示工具
 * @Author: zhoualnglang 
 * @Date: 2020-04-24 11:05:19 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-24 12:09:58
 */
class TipModel extends BaseClass {

    public static ins(): TipModel {
        return super.ins();
    }

    public constructor() {
        super();
    }

    private _view: BaseEuiLayer
    private tipItem: TipItem

    public show(obj: { icon?, title?: string, duration?: number }) {
        if (!this._view) {
            this._view = LayerManager.UI_Tips
        }
        if (!this._view.parent) {
            return
        }
        if (!this.tipItem) {
            this.tipItem = new TipItem()
            this.tipItem.verticalCenter = 0
            this.tipItem.horizontalCenter = 0
        }
        if (!this.tipItem.parent) {
            this._view.addChild(this.tipItem)
        }
        else {
            TimerManager.ins().remove(this.hide, this)
        }
        this.tipItem.visible = true
        this.tipItem.show(obj.title)
        TimerManager.ins().doTimer(3000, 1, this.hide, this)
    }

    private hide() {
        this.tipItem.visible = false
        this.tipItem.hide()
        DisplayUtils.removeFromParent(this.tipItem)
    }
}
window["TipModel"] = TipModel;
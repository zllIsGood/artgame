/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-24 11:09:27 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-24 11:23:48
 */
class TipItem extends eui.ItemRenderer {

    private lab: eui.Label;

    public constructor() {
        super();
        this.skinName = "TipItemSkin";
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

    public childrenCreated(): void {
        super.childrenCreated();
    }

    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
    }

    protected dataChanged() {

    }

    public show(str) {
        this.lab.text = str
    }

    public hide() {
        this.lab.text = ''
        this.visible = false
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

}
window["TipItem"] = TipItem;
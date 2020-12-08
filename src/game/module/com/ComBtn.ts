/* 带小图的按钮
 * @Author: zhoualnglang 
 * @Date: 2020-04-01 16:15:07 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-21 18:19:57
 */
class ComBtn extends eui.Button {

    public miniLabelObj?: eui.Label
    public miniLabel: string
    public miniIcon = ''
    public miniIconObj: eui.Image
    public miniScale = 1
    public miniIcon2 = ''
    public miniIconObj2: eui.Image
    public miniScale2 = 1

    public constructor() {
        super();
        // this.skinName = 'ComBtnSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }

    public onClick() {
        // SoundManager.ins().playEffect('square_tap_mp3')
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    }
}
window["ComBtn"] = ComBtn;
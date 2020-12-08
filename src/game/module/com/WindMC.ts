/* 风
 * @Author: zhoualnglang 
 * @Date: 2020-05-28 10:46:41 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-28 12:23:58
 */
class WindMC extends eui.Component {

    private cur = 0
    private maxN = 8
    public constructor() {
        super();
        this.skinName = 'WindMCSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.init()
    }

    public addParent(parent: egret.DisplayObjectContainer) {
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        parent.addChild(this)
    }

    public init() {
        for (let i = 0; i < this.maxN; i++) {
            let img = this['img' + i] as eui.Image
            let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getTintFilter(0xFFF7B6, 0.5));
            img.filters = [colorFlilter]
        }
    }

    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.upView()
    }

    private upView() {
        this.cur = MathUtils.limitInteger(0, this.maxN / 2) //0
        for (let i = 0; i < this.maxN; i++) {
            let img = this['img' + i] as eui.Image
            img.visible = i == this.cur
        }
        TimerManager.ins().doTimer(100, this.maxN, this.onChange, this, this.finsh, this)
    }

    private onChange() {
        this.cur++
        for (let i = 0; i < this.maxN; i++) {
            let img = this['img' + i] as eui.Image
            img.visible = i == this.cur
        }
        if (this.cur > this.maxN) {
            TimerManager.ins().remove(this.onChange, this)
            this.finsh()
        }
    }

    private finsh() {
        DisplayUtils.removeFromParent(this)
        let wind = WeatherFactory.getWind()
        wind.resetItem(this)
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.cur = 0
        TimerManager.ins().removeAll(this)
    }
}
window["WindMC"] = WindMC;
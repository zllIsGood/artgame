/*
 * @Author: zhoualnglang 
 * @Date: 2020-05-26 10:35:08 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-26 20:14:29
 */
class QuiltItem extends eui.ItemRenderer {

    private img: eui.Image;
    private bg: eui.Image;
    data: { type: number, imgN: number, tintN: number }

    public constructor() {
        super();
        this.skinName = "QuiltItemSkin";
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
        let data = this.data
        if (data.type == 0) {
            this.currentState = '0'
            let src = QuiltData.IMG[0][data.imgN]
            this.bg.source = src
            this.img.source = ''

            let cfg = QuiltData.OneCfg[data.imgN]
            let isFilter = cfg & 0b000001
            if (isFilter) {
                let tint = ColorUtil.getTintFilter(QuiltData.tintColor[data.tintN], 0.3)
                this.colorFlilter = new egret.ColorMatrixFilter(tint)
                this.bg.filters = [this.colorFlilter]
            }
            else {
                this.bg.filters = []
                this.colorFlilter = null
            }
            DisplayUtils.setScale(this.bg, 1.11)
        }
        else if (data.type == 1) {
            this.currentState = '1'
            let src = QuiltData.IMG[1][data.imgN]
            this.bg.source = src
            this.img.source = src + '_decal'
            let tint = ColorUtil.getTintFilter(QuiltData.tintColor[data.tintN], 0.3)
            this.colorFlilter = new egret.ColorMatrixFilter(tint)

            this.bg.filters = [this.colorFlilter]
            this.img.rotation = (data.imgN == 0 || data.imgN == 5) ? -90 : 0
            DisplayUtils.setScale(this.bg, 1)
        }
    }

    public colorFlilter: egret.ColorMatrixFilter

    public setGlowFilter() {
        let fil = ColorUtil.getGlowFilter()
        let filters = this.colorFlilter ? [this.colorFlilter, fil] : [fil]
        this.bg.filters = filters
    }

    public clearGlowFilter() {
        let filters = this.colorFlilter ? [this.colorFlilter] : null
        this.bg.filters = filters
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.colorFlilter = null
    }

}
window["QuiltItem"] = QuiltItem;
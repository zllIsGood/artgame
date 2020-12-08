/*
 * @Author: zhoualnglang 
 * @Date: 2020-05-23 17:12:37 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-30 16:38:15
 */
class HieroglyphModel extends BaseClass {
    public static ins(): HieroglyphModel {
        return super.ins();
    }

    public constructor() {
        super();
    }

    /**是否首次*/
    public isFirst() {
        let str = CacheUtil.get(Constant.Hieroglyph_PaintData)
        if (str && str != '') {
            return false
        }
        else {
            return true
        }
    }

    private _paintData: number[] = null
    public get paintData() {
        if (this._paintData == null) {
            let str = CacheUtil.get(Constant.Hieroglyph_PaintData)
            if (str && str != '') {
                this._paintData = JSON.parse(str)
            }
            else {
                this._paintData = [0, 0, 0, 2, 6]
            }
        }
        return this._paintData
    }

    public setPaintData(btn: number) {
        let icon = this.paintData[btn] + 1
        if (btn != HieroglyphData.Button_Icon.length - 1) {
            let max = HieroglyphData.Button_Icon[btn].length
            icon = icon >= max ? 0 : icon
            this.paintData[btn] = icon
        }
        else {
            let max = HieroglyphData.COLOR.length
            icon = icon >= max ? 0 : icon
            this.paintData[btn] = icon
        }
    }

    /**保存*/
    public cachePaintData() {
        CacheUtil.set(Constant.Hieroglyph_PaintData, JSON.stringify(this.paintData))
    }

    public config: {
        frames, //: { frame, rotated, trimmed, spriteSourceSize }[],
        animations
    } = null
    public async getConfig() {
        if (this.config == null) {
            this.config = await RES.getResByUrl(App.ins().getResRoot() + HieroglyphData.URL, null, null, RES.ResourceItem.TYPE_JSON)
        }
        return this.config
    }

}
window["HieroglyphModel"] = HieroglyphModel;
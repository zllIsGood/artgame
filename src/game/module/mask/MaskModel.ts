/*
 * @Author: zhoualnglang 
 * @Date: 2020-05-21 16:56:15 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-22 15:16:05
 */
class MaskModel extends BaseClass {
    public static ins(): MaskModel {
        return super.ins();
    }

    public constructor() {
        super();
    }
    /**是否首次玩游戏*/
    public isFirst() {
        let str = CacheUtil.get(Constant.MASK_PaintData)
        if (str && str != '') {
            return false
        }
        else {
            return true
        }
    }

    private _seltctID: number = null
    public set seltctID(cur: number) {
        this._seltctID = cur
        CacheUtil.set(Constant.MASK_SelectID, String(cur))
    }
    public get seltctID() {
        if (this._seltctID == null) {
            let str = CacheUtil.get(Constant.MASK_SelectID)
            if (str && str != '') {
                this._seltctID = Number(str)
            }
            else {
                this._seltctID = -1
            }
        }
        return this._seltctID
    }

    private _paintData: number[][] = null
    public get paintData() {
        if (this._paintData == null) {
            let str = CacheUtil.get(Constant.MASK_PaintData)
            if (str && str != '') {
                this._paintData = JSON.parse(str)
            }
            else {
                this._paintData = JSON.parse(JSON.stringify(MASK_LAYER_DATA))
            }
        }
        return this._paintData
    }

    public setPaintData(id: number, layer: number, color: number) {
        if (this.paintData[id] == null) {
            this.paintData[id] = []
        }
        this.paintData[id][layer] = color
    }

    public clearPaintData(id: number) {
        let arr = this.paintData[id]
        for (let i in arr) {
            arr[i] = 0xffffff
        }
    }

    /**保存*/
    public cachePaintData() {
        CacheUtil.set(Constant.MASK_PaintData, JSON.stringify(this.paintData))
    }

    public config: {
        frames, //: { frame, rotated, trimmed, spriteSourceSize }[],
        animations
    }[] = []
    public async getConfig(cur: number) {
        if (this.config[cur] == null) {
            this.config[cur] = await RES.getResByUrl(App.ins().getResRoot() + MASK_URL[cur], null, null, RES.ResourceItem.TYPE_JSON)
        }
        return this.config[cur]
    }

    public getMat(cur: number, src: string) {
        let imgData = this.config[cur]
        if (imgData == null) {
            return null
        }
        else {
            let animations = imgData.animations
            let arr: string[] = null
            for (let i in animations) {
                arr = arr == null ? animations[i] : arr
            }
            let index = arr.indexOf(src)
            let color = this.paintData[cur][index]
            let mat = ColorUtil.getMatByColor(color)
            return mat
        }
    }
}
window["MaskModel"] = MaskModel;
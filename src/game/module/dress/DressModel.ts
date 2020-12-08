/*
 * @Author: zhoualnglang 
 * @Date: 2020-05-22 14:37:29 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-22 17:37:58
 */
class DressModel extends BaseClass {
    public static ins(): DressModel {
        return super.ins();
    }

    public constructor() {
        super();
    }

    private _seltctID: number = null
    public set seltctID(cur: number) {
        this._seltctID = cur
        CacheUtil.set(Constant.DRESS_SelectID, String(cur))
    }
    public get seltctID() {
        if (this._seltctID == null) {
            let str = CacheUtil.get(Constant.DRESS_SelectID)
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
            let str = CacheUtil.get(Constant.DRESS_PaintData)
            if (str && str != '') {
                this._paintData = JSON.parse(str)
            }
            else {
                this._paintData = [[], []]
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
        CacheUtil.set(Constant.DRESS_PaintData, JSON.stringify(this.paintData))
    }

    public config: {
        frames, //: { frame, rotated, trimmed, spriteSourceSize }[],
        animations
    }[] = []
    public async getConfig(cur: number) {
        if (this.config[cur] == null) {
            this.config[cur] = await RES.getResByUrl(App.ins().getResRoot() + DRESS_URL[cur], null, null, RES.ResourceItem.TYPE_JSON)
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
            color = color == null ? 0xfffffff : color
            let mat = ColorUtil.getMatByColor(color)
            return mat
        }
    }
}
window["DressModel"] = DressModel;
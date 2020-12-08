/*
 * @Author: zhoualnglang 
 * @Date: 2020-05-22 17:37:40 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-22 17:41:27
 */
class DollModel extends BaseClass {
    public static ins(): DollModel {
        return super.ins();
    }

    public constructor() {
        super();
    }

    private _seltctID: number = null
    public set seltctID(cur: number) {
        this._seltctID = cur
        CacheUtil.set(Constant.DOLL_SelectID, String(cur))
    }
    public get seltctID() {
        if (this._seltctID == null) {
            let str = CacheUtil.get(Constant.DOLL_SelectID)
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
            let str = CacheUtil.get(Constant.DOLL_PaintData)
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
        CacheUtil.set(Constant.DOLL_PaintData, JSON.stringify(this.paintData))
    }

    public config: {
        frames, //: { frame, rotated, trimmed, spriteSourceSize }[],
        animations
    }[] = []
    public async getConfig(cur: number) {
        if (this.config[cur] == null) {
            this.config[cur] = await RES.getResByUrl(App.ins().getResRoot() + DOLL_URL[cur], null, null, RES.ResourceItem.TYPE_JSON)
        }
        return this.config[cur]
    }

    public getMat(cur: number, index: number) {
        let color = this.paintData[cur][index]
        color = color == null ? 0xfffffff : color
        let mat = ColorUtil.getMatByColor(color)
        return mat
    }
}
window["DollModel"] = DollModel;
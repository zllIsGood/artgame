/*
 * @Author: zhoualnglang 
 * @Date: 2020-05-23 15:51:53 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-26 20:35:46
 */
class QuiltModel extends BaseClass {
    public static ins(): QuiltModel {
        return super.ins();
    }

    public constructor() {
        super();
    }

    private _seltctID: number = null
    public set seltctID(cur: number) {
        this._seltctID = cur
        CacheUtil.set(Constant.QUILT_SelectID, String(cur))
    }
    public get seltctID() {
        if (this._seltctID == null) {
            let str = CacheUtil.get(Constant.QUILT_SelectID)
            if (str && str != '') {
                this._seltctID = Number(str)
            }
            else {
                this._seltctID = -1
            }
        }
        return this._seltctID
    }

    private _paintData: { type: number, imgN: number, tintN: number, gridX?: number, gridY?: number }[][] = null

    public get paintData() {
        if (this._paintData == null) {
            let str = CacheUtil.get(Constant.QUILT_PaintData)
            if (str && str != '') {
                this._paintData = JSON.parse(str)
            }
            else {
                this._paintData = [[], new Array(25)]
            }
        }
        return this._paintData
    }

    public setPaintData(gridX: number, gridY: number, data: { type: number, imgN: number, tintN: number }) {
        let type = data.type
        let paintData = this.paintData[type]
        if (type == 0) {
            let obj = { type: 0, imgN: data.imgN, tintN: data.tintN, gridX: gridX, gridY: gridY }
            paintData.push(obj)
            if (this.grid0 == null) {
                this.grid0 = new Array(25)
            }
            for (let i = 0; i < paintData.length; i++) {
                let n = paintData[i].imgN
                let x = paintData[i].gridX
                let y = paintData[i].gridY
                let cfg = QuiltData.OneCfg[n]

                this.setGrid0(x, y, n)
                if (cfg & 0b111101) {
                    this.setGrid0(x + 1, y, n)
                    this.setGrid0(x, y + 1, n)
                    this.setGrid0(x + 1, y + 1, n)
                }
                else if (cfg & 0b110010) {
                    this.setGrid0(x + 1, y, n)
                    this.setGrid0(x + 2, y, n)
                }
                else if (cfg & 0b101100) {
                    this.setGrid0(x, y + 1, n)
                    this.setGrid0(x + 1, y + 1, n)
                }
            }
            // for (let j = paintData.length - 1; j >= 0; j--) {
            //     let n = paintData[j].imgN
            //     let bool = this.hasGrid0(n)
            //     if (!bool) {
            //         paintData.splice(j, 1)
            //     }
            // }
        }
        else if (type == 1) {
            let layer = gridX + gridY * 5
            paintData[layer] = data
        }
    }

    /*private hasGrid0(n) {
        for (let i in this.grid0) {
            if (n == this.grid0[i]) {
                return true
            }
        }
        return false
    }*/
    private setGrid0(x, y, n) {
        if (x < 5 && y < 5) {
            this.grid0[x + y * 5] = n
        }
    }
    private grid0: number[]

    public clearPaintData(type: number) {
        let arr = this.paintData[type]
        if (type == 0) {
            this.paintData[type] = []
        }
        else if (type == 1) {
            this.paintData[type] = new Array(25)
        }
    }

    /**保存*/
    public cachePaintData() {
        CacheUtil.set(Constant.QUILT_PaintData, JSON.stringify(this.paintData))
    }
}
window["QuiltModel"] = QuiltModel;
/*
 * @Author: zhoualnglang 
 * @Date: 2020-05-30 12:17:44 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-30 16:31:07
 */
class LockModel extends BaseClass {

    public static ins(): LockModel {
        return super.ins();
    }

    public constructor() {
        super();
    }

    private _data: {
        color: { mask, dress, doll },
        dress,
        hier
    } = null

    public get data() {
        if (this._data == null) {
            let str = CacheUtil.get(Constant.LOCK_DATA)
            if (str && str != '') {
                this._data = JSON.parse(str)
            }
            else {
                this._data = {
                    color: {
                        mask: [true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
                        dress: [true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
                        doll: [true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,]
                    },
                    dress: false,
                    hier: [false, false]
                }
            }
        }
        return this._data
    }

    public isLock(parm: { type: LockType, index, color?, win?}) {
        if (!App.ins().isOpenAd()) {
            return false
        }
        if (parm.type == LockType.color) {
            if (this.data.color[parm.win][parm.index]) {
                return false
            }
        }
        else if (parm.type == LockType.dress) {
            if (this.data.dress) {
                return false
            }
        }
        else if (parm.type == LockType.hier) {
            if (this.data.hier[parm.index - 1]) {
                return false
            }
        }
        return true
    }
    /**保存*/
    public cacheData(parm: { type: LockType, index, color?, win?}) {
        if (parm.type == LockType.color) {
            this.data.color[parm.win][parm.index] = true
        }
        else if (parm.type == LockType.dress) {
            this.data.dress = true
        }
        else if (parm.type == LockType.hier) {
            this.data.hier[parm.index - 1] = true
        }

        CacheUtil.set(Constant.LOCK_DATA, JSON.stringify(this.data))
    }
}
window["LockModel"] = LockModel;
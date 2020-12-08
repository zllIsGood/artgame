/*
 * @Author: zhoualnglang 
 * @Date: 2020-05-22 14:36:02 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-30 16:52:48
 */
class DressWin extends BaseEuiView {

    private bg: eui.Image
    private grp: eui.Group;
    private leftBtn: BaseBtn
    private rightBtn: BaseBtn
    private clearBtn: BaseBtn
    private submitBtn: BaseBtn
    private upBtn: BaseBtn
    private downBtn: BaseBtn
    private colorList: eui.Group

    private curId = 0

    constructor() {
        super();
        this.skinName = `DressSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.leftBtn, this.onClick);
        this.addTouchEvent(this.rightBtn, this.onClick);
        this.addTouchEvent(this.clearBtn, this.onClick);
        this.addTouchEvent(this.submitBtn, this.onClick);
        this.addTouchEvent(this.upBtn, this.onClick);
        this.addTouchEvent(this.downBtn, this.onClick);

        EventManger.ins().add(this.grp, this, new EventObj(this, this.onTapRecognized, this.onMove, this.onTap))

        let curid = DressModel.ins().seltctID
        this.curId = curid >= 0 ? curid : 0
        this.selectColor = this._colours[0]
        this.upView()
        this.upColor()
        StageUtils.ins().adaptationIpx(this.bg)
    }

    private onMove(dx: number, dy: number) {
        this.grp.x += dx
        this.grp.y += dy
    }

    private onTap(e: egret.TouchEvent) {
        if (this.selectColor == null) {
            return
        }
        // console.log(e)
        let xy = this.grp.globalToLocal(e.stageX, e.stageY)
        this.hit(xy.x, xy.y)
    }

    private onTapRecognized(e: GestureEvent): void {
        // console.log('onTapRecognized:', e)
        if (e.dScale < 1) {
            this.grp.scaleX -= 0.01;
            this.grp.scaleY -= 0.01;
            this.grp.scaleX = this.grp.scaleX < 0.5 ? 0.5 : this.grp.scaleX
            this.grp.scaleY = this.grp.scaleY < 0.5 ? 0.5 : this.grp.scaleY
        }
        else if (e.dScale > 1) {
            this.grp.scaleX += 0.01;
            this.grp.scaleY += 0.01;
        }
    }

    private async upView() {
        let json = await DressModel.ins().getConfig(this.curId)
        // console.log(json)
        this.imgData = json
        this.grp.width = DRESS_WH[this.curId].w
        this.grp.height = DRESS_WH[this.curId].h
        let w = 1664
        let h = 768
        this.grp.x = w / 2 - this.grp.width / 2
        this.grp.y = h / 2 - this.grp.height / 2
        DisplayUtils.setScale(this.grp, 1)
        this.updata()
    }

    private imgData: {
        frames, //: { any: { frame, rotated, trimmed, spriteSourceSize } },
        animations
    }

    private imgobjs: eui.Image[] = []
    private _colours: number[] = [
        ColorUtil.mergeRGB(255, 240, 77), // Yellow
        ColorUtil.mergeRGB(255, 162, 2), // Orange
        // ColorUtil.mergeRGB(255, 6, 0), // Red
        ColorUtil.mergeRGB(173, 255, 67), // Lime Green
        ColorUtil.mergeRGB(0, 175, 74), // Forest Green
        ColorUtil.mergeRGB(67, 221, 255), // Cyan
        ColorUtil.mergeRGB(32, 132, 254), // Blue
        ColorUtil.mergeRGB(227, 195, 14), // Yellow
        ColorUtil.mergeRGB(255, 119, 1), // Orange
        ColorUtil.mergeRGB(223, 37, 0), // Red
        ColorUtil.mergeRGB(14, 146, 1), // Green
        ColorUtil.mergeRGB(0, 50, 233), // Blue
        ColorUtil.mergeRGB(151, 177, 226), // Purple
        ColorUtil.mergeRGB(129, 64, 0), // Brown
        ColorUtil.mergeRGB(255, 255, 255), // White
        ColorUtil.mergeRGB(0, 0, 0), // Black
    ];
    private selectColor: number = null
    private colorN = 0

    private upColor() {
        this.removeColorList()
        let max = Math.ceil(this._colours.length / 5)
        let n = this.colorN
        let arr = this._colours.slice(n * 5, n * 5 + 5)
        let yi = 0
        for (let color of arr) {
            let obj = new BaseBtn()
            obj.skinName = 'BaseBtnSkin'
            obj.icon = 'button_paint_bg'
            obj.miniIcon = 'button_paint_fill'
            obj.miniIconObj.verticalCenter = -2.5
            obj.x = 0
            obj.y = 105 * yi
            let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getMatByColor(color));
            obj.miniIconObj.filters = [colorFlilter]

            this.colorList.addChild(obj)
            obj.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickColor, this)
            yi++
        }

        if (n == 0) {
            this.upBtn.enabled = false
            this.downBtn.enabled = true
        }
        else if (n >= max - 1) {
            this.upBtn.enabled = true
            this.downBtn.enabled = false
        }
        else {
            this.upBtn.enabled = true
            this.downBtn.enabled = true
        }

        this.upColorFilters()
    }

    private removeColorList() {
        for (let i in this.colorList.$children) {
            let child = this.colorList.$children[i]
            child.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickColor, this)
        }
        this.colorList.removeChildren()
    }

    private clickColor(e: egret.Event) {
        let tar = e.currentTarget as BaseBtn
        let index = tar.parent.getChildIndex(tar)
        let n = this.colorN
        let arr = this._colours.slice(n * 5, n * 5 + 5)

        let lock_n = n * 5 + index
        let parm = { type: LockType.color, index: lock_n, color: arr[index], win: 'dress' }
        if (LockModel.ins().isLock(parm)) {
            ViewManager.ins().open(LockWin, parm)
            return
        }

        this.selectColor = arr[index]
        this.upColorFilters()
    }

    private upColorFilters() {
        let n1 = this._colours.indexOf(this.selectColor)
        let curn = n1 - this.colorN * 5
        let filter = null
        if (curn >= 0 && curn < 5) {
            filter = [ColorUtil.getGlowFilter()]
        }
        for (let i in this.colorList.$children) {
            let child = this.colorList.$children[i] as BaseBtn
            let index = parseInt(i)
            child.filters = index == curn ? filter : null
        }
    }

    private updata() {
        this.grp.removeChildren()
        this.imgobjs = []

        let data = this.imgData
        let frames = data.frames
        let scale = DRESS_Scale[this.curId]
        for (let i in frames) {
            let item = frames[i]
            let img = new eui.Image()
            img.source = i
            img.name = i
            if (item.rotated) {
                img.x = item.spriteSourceSize.x
                img.y = item.spriteSourceSize.y + item.frame.h
                img.rotation = -90
            }
            else {
                img.x = item.spriteSourceSize.x
                img.y = item.spriteSourceSize.y
                img.rotation = 0
            }
            if (item.trimmed) {
                img.scaleX = img.scaleY = scale
                img.x = img.x * scale
                img.y = img.y * scale
                let mat = DressModel.ins().getMat(this.curId, i)
                let colorFlilter = new egret.ColorMatrixFilter(mat);
                img.filters = [colorFlilter];
            }
            else {
                img.scaleX = img.scaleY = 1
            }

            this.grp.addChild(img)
            this.imgobjs.push(img)
        }
    }

    private hit(touch_x: number, touch_y: number) {
        let hit_scale = DRESS_HIT_Scale[this.curId]
        let gridX = Math.ceil(touch_x / hit_scale)
        let gridY = Math.ceil(touch_y / hit_scale)
        let area = this.curId
        let animations = this.imgData.animations
        let arr = null
        for (let i in animations) {
            arr = arr == null ? animations[i] : arr
        }
        let areaData = DRESS_HIT_AREAS[area]

        if (areaData[gridX]) {
            let n = areaData[gridX][gridY]
            if (n >= 0) {
                let img = this.grp.getChildByName(arr[n]) as eui.Image
                let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getMatByColor(this.selectColor));
                img.filters = [colorFlilter];

                let index = this.imgobjs.indexOf(img)
                DressModel.ins().setPaintData(this.curId, index, this.selectColor)
            }
        }
    }

    public close(...param: any[]): void {
        this.selectColor = null
        this.grp.removeChildren()
        this.imgobjs = []
        this.removeColorList()
        EventManger.ins().removeAll(this.grp)
    }

    /**点击 */
    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.leftBtn:
                let parm = { type: LockType.dress, index: 1 }
                if (LockModel.ins().isLock(parm)) {
                    ViewManager.ins().open(LockWin, parm)
                    return
                }
                this.curId--
                if (this.curId < 0) {
                    this.curId = DRESS_HIT_AREAS.length - 1
                }
                this.upView()
                break;
            case this.rightBtn:
                let parm2 = { type: LockType.dress, index: 1 }
                if (LockModel.ins().isLock(parm2)) {
                    ViewManager.ins().open(LockWin, parm2)
                    return
                }
                this.curId++
                if (this.curId > DRESS_HIT_AREAS.length - 1) {
                    this.curId = 0
                }
                this.upView()
                break;
            case this.clearBtn:
                DressModel.ins().clearPaintData(this.curId)
                this.updata()
                break;
            case this.submitBtn:
                DressModel.ins().cachePaintData()
                DressModel.ins().seltctID = this.curId
                ViewManager.ins().close(this)
                ViewManager.ins().open(HomeWin)
                break;
            case this.upBtn:
                if (this.colorN <= 0) {
                    return
                }
                else {
                    let max = Math.ceil(this._colours.length / 5)
                    this.colorN--
                    this.upColor()
                }
                break;
            case this.downBtn:
                let max2 = Math.ceil(this._colours.length / 5)
                if (this.colorN >= max2 - 1) {
                    return
                }
                else {
                    this.colorN++
                    this.upColor()
                }
                break;
        }
    }

}
ViewManager.ins().reg(DressWin, LayerManager.UI_Popup);
window["DressWin"] = DressWin;
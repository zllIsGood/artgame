/*
 * @Author: zhoualnglang 
 * @Date: 2020-05-13 10:59:12 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-30 16:51:28
 */
class MaskWin extends BaseEuiView {

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
    // private tapMode: TapMode = TapMode.Tap  //点击模式
    // private touchCount = 0  //点击数
    // private disXY = { x: 0, y: 0 }

    constructor() {
        super();
        this.skinName = `MaskSkin`;
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

        let curid = MaskModel.ins().seltctID
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
        let json = await MaskModel.ins().getConfig(this.curId)
        // console.log(json)
        this.imgData = json
        this.grp.width = MASK_WH[this.curId].w
        this.grp.height = MASK_WH[this.curId].h
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
        // Day of the Dead
        ColorUtil.mergeRGB(255, 245, 91), // Yellow
        ColorUtil.mergeRGB(255, 167, 50), // Orange
        ColorUtil.mergeRGB(255, 98, 81), // Red
        ColorUtil.mergeRGB(234, 125, 235), // Pink
        ColorUtil.mergeRGB(164, 91, 255), // Purple
        ColorUtil.mergeRGB(174, 255, 109), // Green
        ColorUtil.mergeRGB(68, 197, 239), // Cyan
        ColorUtil.mergeRGB(70, 22, 217), // Blue
        // ColorUtil.mergeRGB(242, 238, 226), // Bone
        ColorUtil.mergeRGB(20, 25, 20), // Black
        // // Chinese Opera
        ColorUtil.mergeRGB(223, 207, 48), // Yellow
        ColorUtil.mergeRGB(228, 133, 53), // Orange
        ColorUtil.mergeRGB(227, 135, 150), // Pink
        ColorUtil.mergeRGB(232, 32, 32), // Red
        ColorUtil.mergeRGB(56, 191, 88), // Green
        ColorUtil.mergeRGB(42, 115, 226), // Blue
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
        let parm = { type: LockType.color, index: lock_n, color: arr[index], win: 'mask' }
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
        let scale = MASK_Scale[this.curId]
        for (let i in frames) {
            let item = frames[i]
            let img = new eui.Image()
            img.source = i
            img.name = i
            // this.drawstate[i] = 0
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
                let mat = MaskModel.ins().getMat(this.curId, i)
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

    /*drawstate = {}
    draw(touch_x: number, touch_y: number) {
        let data = this.data
        let frames = data.frames
        for (let i in frames) {
            let item = frames[i]
            let x, y, w, h
            if (item.rotated) {
                x = item.spriteSourceSize.x
                y = item.spriteSourceSize.y //+ item.frame.h
                w = item.frame.h
                h = item.frame.w
            }
            else {
                x = item.spriteSourceSize.x
                y = item.spriteSourceSize.y
                w = item.frame.w
                h = item.frame.h
            }
            if (item.trimmed) {
                x = x * 4
                y = y * 4
                w = w * 4
                h = h * 4

                if (this.drawstate[i] != 1 &&
                    touch_x >= x && touch_x < x + w && touch_y >= y && touch_y < y + h) {
                    let img = this.grp.getChildByName(i) as eui.Image

                    let dx = (touch_x - x) / 4
                    let dy = (touch_y - y) / 4
                    if (item.rotated) {
                        dy = (touch_x - x) / 4
                        dx = (w - (touch_y - y)) / 4
                        //dy= img.height - dy  //Y坐标 webgl颠倒了
                    }
                    let pixel32 = img.texture.getPixels(dx, dy)
                    if (pixel32[3] > 0) {
                        let colorFlilter = new egret.ColorMatrixFilter(this.colorMatrix_green);
                        img.filters = [colorFlilter];
                        this.drawstate[i] = 1
                        return
                    }
                }
            }
            else {

            }

        }
    }*/

    private hit(touch_x: number, touch_y: number) {
        let gridX = Math.ceil(touch_x / 8)
        let gridY = Math.ceil(touch_y / 8)
        let area = this.curId
        let animations = this.imgData.animations
        let arr = null
        for (let i in animations) {
            arr = arr == null ? animations[i] : arr
        }
        if (MASK_HIT_AREAS[area][gridX]) {
            let n = MASK_HIT_AREAS[area][gridX][gridY]
            if (n >= 0) {
                let img = this.grp.getChildByName(arr[n]) as eui.Image
                let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getMatByColor(this.selectColor));
                img.filters = [colorFlilter];

                let index = this.imgobjs.indexOf(img)
                MaskModel.ins().setPaintData(this.curId, index, this.selectColor)
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
        // console.log(e)
        switch (e.currentTarget) {
            case this.leftBtn:
                this.curId--
                if (this.curId < 0) {
                    this.curId = MASK_HIT_AREAS.length - 1
                }
                this.upView()
                break;
            case this.rightBtn:
                this.curId++
                if (this.curId > MASK_HIT_AREAS.length - 1) {
                    this.curId = 0
                }
                this.upView()
                break;
            case this.clearBtn:
                MaskModel.ins().clearPaintData(this.curId)
                this.updata()
                break;
            case this.submitBtn:
                MaskModel.ins().cachePaintData()
                MaskModel.ins().seltctID = this.curId
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
ViewManager.ins().reg(MaskWin, LayerManager.UI_Popup);
window["MaskWin"] = MaskWin;
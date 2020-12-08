/*
 * @Author: zhoualnglang 
 * @Date: 2020-05-22 17:38:21 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-30 16:53:20
 */
class DollWin extends BaseEuiView {

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
        this.skinName = `DollSkin`;
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
        // this.addTouchEvent(this.grp, this.onClick);

        EventManger.ins().add(this.grp, this, new EventObj(this, this.onTapRecognized, this.onMove, this.onTap))

        let curid = DollModel.ins().seltctID
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
        let json = await DollModel.ins().getConfig(this.curId)
        // console.log(json)
        this.imgData = json
        this.grp.width = DOLL_WH[this.curId].w
        this.grp.height = DOLL_WH[this.curId].h
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
        // Bear
        ColorUtil.mergeRGB(234, 186, 0), // Yellow
        ColorUtil.mergeRGB(254, 109, 114), // Salmon
        ColorUtil.mergeRGB(220, 5, 10), // Red
        ColorUtil.mergeRGB(41, 157, 34), // Lime Green
        ColorUtil.mergeRGB(2, 69, 26), // Forest Green
        ColorUtil.mergeRGB(6, 149, 191), // Cyan
        ColorUtil.mergeRGB(0, 24, 148), // Blue
        // Matryoshka
        ColorUtil.mergeRGB(143, 36, 0), // Maroon
        ColorUtil.mergeRGB(119, 9, 170), // Purple
        ColorUtil.mergeRGB(99, 132, 201), // Frost
        ColorUtil.mergeRGB(153, 33, 87), // Burghundy
        ColorUtil.mergeRGB(23, 217, 227), // Cyan
        ColorUtil.mergeRGB(191, 93, 6), // Orange
        ColorUtil.mergeRGB(0, 0, 52), // Blue
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
        let parm = { type: LockType.color, index: lock_n, color: arr[index], win: 'doll' }
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
        let arrData = DOLL_Normal[this.curId]
        let arrStr: string[] = data.animations[arrData[0]]
        let arrStr1: string[] = data.animations[arrData[1]]
        let arrBasic = DOLL_BasicImg[this.curId]

        this.drawImg(arrStr)
        this.drawImg(arrStr1)
        this.drawImg(arrBasic)
    }

    private drawImg(arrStr: string[]) {
        let frames = this.imgData.frames
        let scale = DOLL_Scale[this.curId]
        for (let j in arrStr) {
            let i = arrStr[j]
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
                let mat = DollModel.ins().getMat(this.curId, Number(j))
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
        let hit_scale = DOLL_HIT_Scale[this.curId]
        let gridX = Math.ceil(touch_x / hit_scale)
        let gridY = Math.ceil(touch_y / hit_scale)
        let area = this.curId

        let arrData = DOLL_Normal[this.curId]
        let arrStr: string[] = this.imgData.animations[arrData[0]]
        let arrStr1: string[] = this.imgData.animations[arrData[1]]

        let areaData = DOLL_HIT_AREAS[area]
        if (areaData[gridX]) {
            let n = areaData[gridX][gridY]
            if (n >= 0) {
                let img = this.grp.getChildByName(arrStr[n]) as eui.Image
                let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getMatByColor(this.selectColor));
                img.filters = [colorFlilter];
                img = this.grp.getChildByName(arrStr1[n]) as eui.Image
                img.filters = [colorFlilter];

                let index = this.imgobjs.indexOf(img)
                DollModel.ins().setPaintData(this.curId, n, this.selectColor)
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
                this.curId--
                if (this.curId < 0) {
                    this.curId = DOLL_HIT_AREAS.length - 1
                }
                this.upView()
                break;
            case this.rightBtn:
                this.curId++
                if (this.curId > DOLL_HIT_AREAS.length - 1) {
                    this.curId = 0
                }
                this.upView()
                break;
            case this.clearBtn:
                DollModel.ins().clearPaintData(this.curId)
                this.updata()
                break;
            case this.submitBtn:
                DollModel.ins().cachePaintData()
                DollModel.ins().seltctID = this.curId
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
ViewManager.ins().reg(DollWin, LayerManager.UI_Popup);
window["DollWin"] = DollWin;
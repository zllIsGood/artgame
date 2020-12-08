/*
 * @Author: zhoualnglang 
 * @Date: 2020-05-23 15:01:38 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-26 20:06:38
 */
class QuiltWin extends BaseEuiView {

    private bg: eui.Image
    private itemGrp: eui.Group;
    private leftBtn: BaseBtn
    private rightBtn: BaseBtn
    private clearBtn: BaseBtn
    private submitBtn: BaseBtn
    private circleBtn: BaseBtn
    private item0: QuiltItem
    private item1: QuiltItem
    private item2: QuiltItem

    private curId = 0
    private selectData = -1
    private itemData: { type: number, imgN: number, tintN: number }[] = []

    private img1s: QuiltItem[][] = new Array(5)

    constructor() {
        super();
        this.skinName = `QuiltSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.leftBtn, this.onClick);
        this.addTouchEvent(this.rightBtn, this.onClick);
        this.addTouchEvent(this.clearBtn, this.onClick);
        this.addTouchEvent(this.submitBtn, this.onClick);
        this.addTouchEvent(this.circleBtn, this.onClick);
        this.addTouchEvent(this.itemGrp, this.onClick);
        this.addTouchEvent(this.item0, this.onClick);
        this.addTouchEvent(this.item1, this.onClick);
        this.addTouchEvent(this.item2, this.onClick);

        let curid = QuiltModel.ins().seltctID
        this.curId = curid >= 0 ? curid : 0
        this.itemGrp.mask = new egret.Rectangle(0, 0, this.itemGrp.width, this.itemGrp.height)
        this.upView()
        StageUtils.ins().adaptationIpx(this.bg)
    }

    private async upView() {
        this.updata()
        this.upGrid()
    }

    private updata() {
        let type = this.curId
        let imglen = QuiltData.IMG[type].length
        let tintlen = QuiltData.tintColor.length
        this.itemData = []

        let imgN = MathUtils.limitInteger(0, imglen - 1)
        let tintN = MathUtils.limitInteger(0, tintlen - 1)
        let data = { type: type, imgN: imgN, tintN: tintN }
        this.item0.data = data
        this.itemData.push(data)

        imgN = imgN >= (imglen - 1) ? 0 : (imgN + 1)
        tintN = MathUtils.limitInteger(0, tintlen - 1)
        data = { type: type, imgN: imgN, tintN: tintN }
        this.item1.data = data
        this.itemData.push(data)

        imgN = imgN >= (imglen - 1) ? 0 : (imgN + 1)
        tintN = MathUtils.limitInteger(0, tintlen - 1)
        data = { type: type, imgN: imgN, tintN: tintN }
        this.item2.data = data
        this.itemData.push(data)
    }

    private upSelect(n: number) {
        for (let i = 0; i < 3; i++) {
            let item = this['item' + i] as QuiltItem
            if (i == n) {
                item.setGlowFilter()
            }
            else {
                item.clearGlowFilter()
            }
        }
    }

    private hit(touch_x: number, touch_y: number) {
        if (this.selectData < 0) {
            return
        }
        let gridX = Math.floor(touch_x / 121)
        let gridY = Math.floor(touch_y / 121)
        let data = this.itemData[this.selectData]
        if (this.curId == 0) {
            QuiltModel.ins().setPaintData(gridX, gridY, data)
            this.setGrid0()
        }
        else if (this.curId == 1) {
            QuiltModel.ins().setPaintData(gridX, gridY, data)
            this.setGrid1(gridX, gridY, data)
        }
    }
    private setGrid0() {
        this.itemGrp.removeChildren()
        let paintData = QuiltModel.ins().paintData[0]
        for (let i = 0; i < paintData.length; i++) {
            let x = paintData[i].gridX
            let y = paintData[i].gridY

            let obj = new QuiltItem()
            obj.x = x * 121
            obj.y = y * 121
            obj.data = paintData[i]
            this.itemGrp.addChild(obj)
        }
    }
    private setGrid1(gridX: number, gridY: number, data: { type: number, imgN: number, tintN: number }) {
        let imgs = this.img1s
        if (!imgs[gridX]) {
            imgs[gridX] = new Array(5)
        }
        if (!imgs[gridX][gridY]) {
            let item = new QuiltItem()
            imgs[gridX][gridY] = item
            item.x = gridX * 121
            item.y = gridY * 121
            item.data = data
            this.itemGrp.addChild(item)
        }
        else {
            let item = imgs[gridX][gridY]
            item.data = data
            if (!item.parent) {
                this.itemGrp.addChild(item)
            }
        }
    }

    private upGrid() {
        this.itemGrp.removeChildren()
        if (this.curId == 0) {
            this.setGrid0()
        }
        else if (this.curId == 1) {
            let datas = QuiltModel.ins().paintData[1]
            for (let i = 0; i < 25; i++) {
                let data = datas[i]
                if (data) {
                    let gridX = i % 5
                    let gridY = Math.floor(i / 5)
                    this.setGrid1(gridX, gridY, data)
                }
            }
        }
    }

    private clearGrid() {
        this.img1s = new Array(5)
        this.itemGrp.removeChildren()
    }

    public close(...param: any[]): void {
        this.itemGrp.mask = null
        this.clearGrid()
        this.selectData = -1
    }

    /**点击 */
    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.itemGrp:
                // console.log(e)
                let xy = this.itemGrp.globalToLocal(e.stageX, e.stageY)
                this.hit(xy.x, xy.y)
                break;
            case this.leftBtn:
                this.selectData = -1
                this.curId--
                if (this.curId < 0) {
                    this.curId = QuiltData.IMG.length - 1
                }
                this.upView()
                break;
            case this.rightBtn:
                this.selectData = -1
                this.curId++
                if (this.curId > QuiltData.IMG.length - 1) {
                    this.curId = 0
                }
                this.upView()
                break;
            case this.clearBtn:
                QuiltModel.ins().clearPaintData(this.curId)
                this.clearGrid()
                break;
            case this.submitBtn:
                QuiltModel.ins().cachePaintData()
                QuiltModel.ins().seltctID = this.curId
                ViewManager.ins().close(this)
                ViewManager.ins().open(HomeWin)
                break;
            case this.circleBtn:
                this.selectData = -1
                this.updata()
                break;
            case this.item0:
                this.selectData = 0
                this.upSelect(0)
                break;
            case this.item1:
                this.selectData = 1
                this.upSelect(1)
                break;
            case this.item2:
                this.selectData = 2
                this.upSelect(2)
                break;
        }
    }

}
ViewManager.ins().reg(QuiltWin, LayerManager.UI_Popup);
window["QuiltWin"] = QuiltWin;
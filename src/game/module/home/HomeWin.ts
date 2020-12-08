/* 主页
 * @Author: zhoualnglang 
 * @Date: 2020-03-31 10:27:29 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-28 12:26:25
 */
class HomeWin extends BaseEuiView {

    bg: eui.Image
    dressGrp: eui.Group
    dressMap: eui.Group
    maskGrp: eui.Group
    dollGrp: eui.Group
    dollMap: eui.Group
    doll: eui.Image
    quiltGrp: eui.Group
    quiltItemGrp: eui.Group

    hieroglyphGrp: eui.Group
    hieroglyphMap: eui.Image
    hieroglyph: eui.Image
    lay0: eui.Image
    lay1: eui.Group
    lay2: eui.Group
    layBg: eui.Image

    setBtn: BaseBtn
    constructor() {
        super();
        this.skinName = `HomeSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.dressGrp, this.onClick);
        this.addTouchEvent(this.hieroglyphGrp, this.onClick);
        this.addTouchEvent(this.quiltGrp, this.onClick);
        this.addTouchEvent(this.dollGrp, this.onClick);
        this.addTouchEvent(this.maskGrp, this.onClick);
        this.addTouchEvent(this.setBtn, this.onClick);
        // this.observe(UserModel.ins().postData, this.upView);

        this.upView()
        StageUtils.ins().adaptationIpx(this.bg)
        // SoundManager.ins().playBg()
    }

    private upView() {
        this.upMask()
        this.upDress()
        this.upDoll()
        this.upQuilt()
        this.upHieroglyph()
    }

    private upHieroglyph() {
        if (HieroglyphModel.ins().isFirst()) {
            this.hieroglyph.visible = true
            this.hieroglyphMap.visible = false
        }
        else {
            this.hieroglyph.visible = false
            this.hieroglyphMap.visible = true

            this.upHierImg()
            this.upWeather()
        }
    }

    /**天气*/
    private upWeather() {
        let weather = HieroglyphModel.ins().paintData[2]
        this.layBg.rotation = 0
        if (weather == 0) { //sun
            this.layBg.source = ''
            this.layBg.filters = null
        }
        else if (weather == 1) { //rain
            this.layBg.source = 'bg'
            this.layBg.alpha = 0.3
            let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getTintFilter(0x0000ff, 0.5));
            this.layBg.filters = [colorFlilter]
        }
        else if (weather == 2) { //wind
            this.layBg.source = 'bg'
            this.layBg.alpha = 0.3
            let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getTintFilter(0xFFF8C1, 0.5));
            this.layBg.filters = [colorFlilter]
        }
        else if (weather == 3) { //night
            this.layBg.source = 'night_overlay'
            this.layBg.alpha = 1
            let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getTintFilter(0x0000ff, 0.5));
            this.layBg.filters = [colorFlilter]
            this.layBg.rotation = -90
        }
    }

    private async upHierImg() {
        let imgData = await HieroglyphModel.ins().getConfig()
        let paintData = HieroglyphModel.ins().paintData

        let imgs0 = HieroglyphData.Layer_Img[0][paintData[3]]
        this.lay0.source = imgs0[0]

        let imgs1 = HieroglyphData.Layer_Img[1][paintData[1]]
        this.lay1.removeChildren()
        for (let icon of imgs1) {
            let obj = new eui.Image()
            obj.source = icon
            let iconcfg = imgData.frames[icon]
            obj.x = iconcfg.spriteSourceSize.x
            if (iconcfg.rotated) {
                obj.rotation = -90
                obj.y = iconcfg.spriteSourceSize.y + iconcfg.spriteSourceSize.h
            }
            else {
                obj.y = iconcfg.spriteSourceSize.y
            }
            this.lay1.addChild(obj)
        }

        let imgs2 = HieroglyphData.Layer_Img[2][paintData[0]]
        this.lay2.removeChildren()
        let color = HieroglyphData.COLOR[paintData[4]]
        for (let icon of imgs2) {
            let obj2 = new eui.Image()
            obj2.source = icon + '_outline'
            let iconcfg2 = imgData.frames[icon + '_outline']
            obj2.x = iconcfg2.spriteSourceSize.x
            if (iconcfg2.rotated) {
                obj2.rotation = -90
                obj2.y = iconcfg2.spriteSourceSize.y + iconcfg2.spriteSourceSize.h
            }
            else {
                obj2.y = iconcfg2.spriteSourceSize.y
            }
            this.lay2.addChild(obj2)

            let obj = new eui.Image()
            obj.source = icon
            let iconcfg = imgData.frames[icon]
            obj.x = iconcfg.spriteSourceSize.x
            if (iconcfg.rotated) {
                obj.rotation = -90
                obj.y = iconcfg.spriteSourceSize.y + iconcfg.spriteSourceSize.h
            }
            else {
                obj.y = iconcfg.spriteSourceSize.y
            }
            this.lay2.addChild(obj)


            if (color != null) {
                let filter = new egret.ColorMatrixFilter(color)
                obj.filters = [filter]
            }
        }
    }

    private upQuilt() {
        this.quiltItemGrp.mask = new egret.Rectangle(0, 0, this.quiltItemGrp.width, this.quiltItemGrp.height)
        this.quiltItemGrp.removeChildren()
        let curId = QuiltModel.ins().seltctID
        if (curId < 0) {
            return
        }
        if (curId == 0) {
            this.quiltImg1s = new Array(5)
            this.setGrid0()
        }
        else if (curId == 1) {
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

    private setGrid0() {
        this.quiltItemGrp.removeChildren()
        let paintData = QuiltModel.ins().paintData[0]
        for (let i = 0; i < paintData.length; i++) {
            let x = paintData[i].gridX
            let y = paintData[i].gridY

            let obj = new QuiltItem()
            obj.x = x * 121
            obj.y = y * 121
            obj.data = paintData[i]
            this.quiltItemGrp.addChild(obj)
        }
    }
    private setGrid1(gridX: number, gridY: number, data: { type: number, imgN: number, tintN: number }) {
        let imgs = this.quiltImg1s
        if (!imgs[gridX]) {
            imgs[gridX] = new Array(5)
        }
        if (!imgs[gridX][gridY]) {
            let item = new QuiltItem()
            imgs[gridX][gridY] = item
            item.x = gridX * 121
            item.y = gridY * 121
            item.data = data
            this.quiltItemGrp.addChild(item)
        }
        else {
            let item = imgs[gridX][gridY]
            item.data = data
            if (!item.parent) {
                this.quiltItemGrp.addChild(item)
            }
        }
    }
    private quiltImg1s: QuiltItem[][] = new Array(5)

    private async upDoll() {
        this.dollMap.removeChildren()
        let curId = DollModel.ins().seltctID
        if (curId < 0) {
            this.doll.visible = true
            return
        }
        this.doll.visible = false

        let data = await DollModel.ins().getConfig(curId)
        let frames = data.frames
        let arrData = DOLL_Normal[curId]
        let arrStr: string[] = data.animations[arrData[0]]
        let arrStr1: string[] = data.animations[arrData[1]]
        let arrBasic = DOLL_BasicImg[curId]

        let wh = DOLL_WH[curId]
        let scale = [0.25, 0.22, 0.19, 0.16]
        let ws = [wh.w * scale[0], wh.w * scale[1], wh.w * scale[2], wh.w * scale[3],]
        let dh = (wh.h * scale[0] - wh.h * scale[3]) / 3
        let x = 0
        for (let i = 0; i < 4; i++) {
            let grp = new eui.Group()

            this.drawDoll(curId, grp, arrStr, frames)
            this.drawDoll(curId, grp, arrStr1, frames)
            this.drawDoll(curId, grp, arrBasic, frames)

            grp.x = x
            x += 10 + ws[i]
            grp.y = dh * i
            DisplayUtils.setScale(grp, scale[i])
            this.dollMap.addChild(grp)
        }
    }

    private drawDoll(curId: number, grp: eui.Group, arrStr: string[], frames) {
        let scale = DOLL_Scale[curId]
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
                let mat = DollModel.ins().getMat(curId, Number(j))
                let colorFlilter = new egret.ColorMatrixFilter(mat);
                img.filters = [colorFlilter];
            }
            else {
                img.scaleX = img.scaleY = 1
            }

            grp.addChild(img)
        }
    }

    private async upDress() {
        this.dressMap.removeChildren()
        let curId = DressModel.ins().seltctID
        if (curId < 0) {
            return
        }
        if (curId == 0) {
            this.dressMap.x = -60
            this.dressMap.y = -284
        }
        else if (curId == 1) {
            this.dressMap.x = -80
            this.dressMap.y = -340
        }

        let data = await DressModel.ins().getConfig(curId)
        let frames = data.frames
        let scale = DRESS_Scale[curId]
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
                let mat = DressModel.ins().getMat(curId, i)
                let colorFlilter = new egret.ColorMatrixFilter(mat);
                img.filters = [colorFlilter];
            }
            else {
                img.scaleX = img.scaleY = 1
            }

            this.dressMap.addChild(img)
        }
    }

    private async upMask() {
        this.maskGrp.removeChildren()
        let curId = MaskModel.ins().seltctID
        let data = await MaskModel.ins().getConfig(curId)
        let frames = data.frames
        let scale = MASK_Scale[curId]
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
                let mat = MaskModel.ins().getMat(curId, i)
                let colorFlilter = new egret.ColorMatrixFilter(mat);
                img.filters = [colorFlilter];
            }
            else {
                img.scaleX = img.scaleY = 1
            }

            this.maskGrp.addChild(img)
        }
    }

    public close(...param: any[]): void {
        // this.removeTouchEvent(this.closeBtn, this.onClick);
        // this.removeObserve();
    }


    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.dressGrp:
                ViewManager.ins().close(this)
                ViewManager.ins().open(DressWin)
                break;
            case this.hieroglyphGrp:
                ViewManager.ins().close(this)
                ViewManager.ins().open(HieroglyphWin)
                break;
            case this.quiltGrp:
                ViewManager.ins().close(this)
                ViewManager.ins().open(QuiltWin)
                break;
            case this.dollGrp:
                ViewManager.ins().close(this)
                ViewManager.ins().open(DollWin)
                break;
            case this.maskGrp:
                ViewManager.ins().close(this)
                ViewManager.ins().open(MaskWin)
                break;
            case this.setBtn:
                ViewManager.ins().open(SetWin)
                break;
        }
    }

}
ViewManager.ins().reg(HomeWin, LayerManager.UI_Main);
window["HomeWin"] = HomeWin;
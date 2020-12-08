/*
 * @Author: zhoualnglang 
 * @Date: 2020-05-23 17:11:10 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-30 16:35:08
 */
class HieroglyphWin extends BaseEuiView {

    private bg: eui.Image
    private grp: eui.Group
    private btn0: BaseBtn
    private btn1: BaseBtn
    private btn2: BaseBtn
    private btn3: BaseBtn
    private btn4: BaseBtn
    private submitBtn: BaseBtn
    private lay0: eui.Image
    private lay1: eui.Group
    private lay2: eui.Group
    private layBg: eui.Image
    public map: eui.Group

    constructor() {
        super();
        this.skinName = `HieroglyphSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.btn0, this.onClick);
        this.addTouchEvent(this.btn1, this.onClick);
        this.addTouchEvent(this.btn2, this.onClick);
        this.addTouchEvent(this.btn3, this.onClick);
        this.addTouchEvent(this.btn4, this.onClick);
        this.addTouchEvent(this.submitBtn, this.onClick);

        this.map.mask = new egret.Rectangle(0, 0, this.map.width, this.map.height)
        this.init()
        StageUtils.ins().adaptationIpx(this.bg)
    }


    private async init() {
        let json = await HieroglyphModel.ins().getConfig()
        // console.log(json)
        this.imgData = json
        this.upView()
        this.upWeather()
    }

    private imgData: {
        frames, //: { frame, rotated, trimmed, spriteSourceSize }[],
        animations
    }

    private upView() {
        this.upBtn()
        this.upImg()
    }
    /**天气*/
    private upWeather() {
        let weather = HieroglyphModel.ins().paintData[2]
        this.layBg.rotation = 0
        WeatherFactory.stopWeather()
        WeatherFactory.getWind().stopWeather()
        if (weather == 0) { //sun
            this.layBg.source = ''
            this.layBg.filters = null
        }
        else if (weather == 1) { //rain
            this.layBg.source = 'bg'
            this.layBg.alpha = 0.3
            let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getTintFilter(0x0000ff, 0.5));
            this.layBg.filters = [colorFlilter]
            WeatherFactory.getWeather(1).playWeather()
        }
        else if (weather == 2) { //wind
            this.layBg.source = 'bg'
            this.layBg.alpha = 0.3
            let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getTintFilter(0xFFF8C1, 0.5));
            this.layBg.filters = [colorFlilter]
            WeatherFactory.getWind().playWeather()
        }
        else if (weather == 3) { //night
            this.layBg.source = 'night_overlay'
            this.layBg.alpha = 1
            let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getTintFilter(0x0000ff, 0.5));
            this.layBg.filters = [colorFlilter]
            this.layBg.rotation = -90
        }
    }

    private upImg() {
        let paintData = HieroglyphModel.ins().paintData

        let imgs0 = HieroglyphData.Layer_Img[0][paintData[3]]
        this.lay0.source = imgs0[0]

        let imgs1 = HieroglyphData.Layer_Img[1][paintData[1]]
        this.lay1.removeChildren()
        for (let icon of imgs1) {
            let obj = new eui.Image()
            obj.source = icon
            let iconcfg = this.imgData.frames[icon]
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
            let iconcfg2 = this.imgData.frames[icon + '_outline']
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
            let iconcfg = this.imgData.frames[icon]
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

    private upBtn() {
        let paintData = HieroglyphModel.ins().paintData
        for (let i = 0; i < 5; i++) {
            let btn = this['btn' + i] as ComBtn  //BaseBtn | ComBtn
            if (i != 4) {
                let icon = HieroglyphData.Button[i]
                let miniIcon = HieroglyphData.Button_Icon[i][paintData[i]]

                btn.icon = icon
                let iconcfg = this.imgData.frames[icon]
                btn.iconDisplay.rotation = iconcfg.rotated ? -90 : 0

                btn.miniIcon = miniIcon
                let miniIconcfg = this.imgData.frames[miniIcon]
                btn.miniIconObj.rotation = miniIconcfg.rotated ? -90 : 0
            }
            else {
                let icon = HieroglyphData.Button[i]
                let miniIcon = HieroglyphData.Button_Icon[i][0]
                let miniIcon2 = HieroglyphData.Button_Icon[i][1]

                btn.icon = icon
                let iconcfg = this.imgData.frames[icon]
                btn.iconDisplay.rotation = iconcfg.rotated ? -90 : 0

                btn.miniIcon = miniIcon;
                let miniIconcfg = this.imgData.frames[miniIcon]
                btn.miniIconObj.rotation = miniIconcfg.rotated ? -90 : 0;

                let color = HieroglyphData.COLOR[paintData[i]]
                if (color != null) {
                    let filter = new egret.ColorMatrixFilter(color)
                    btn.miniIconObj.filters = [filter]
                }
                else {
                    btn.miniIconObj.filters = null
                }

                btn.miniIcon2 = miniIcon2
                let miniIconcfg2 = this.imgData.frames[miniIcon2];
                btn.miniIconObj2.rotation = miniIconcfg2.rotated ? -90 : 0
            }
        }
    }

    public close(...param: any[]): void {
        WeatherFactory.stopWeather()
        WeatherFactory.getWind().stopWeather()
    }

    /**点击 */
    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.btn0:
                HieroglyphModel.ins().setPaintData(0)
                this.upView()
                break;
            case this.btn1:
                HieroglyphModel.ins().setPaintData(1)
                this.upView()
                break;
            case this.btn2:
                HieroglyphModel.ins().setPaintData(2)
                this.upWeather()
                this.upBtn()
                break;
            case this.btn3:
                let parm = { type: LockType.hier, index: 1 }
                if (LockModel.ins().isLock(parm)) {
                    ViewManager.ins().open(LockWin, parm)
                    return
                }
                HieroglyphModel.ins().setPaintData(3)
                this.upView()
                break;
            case this.btn4:
                let parm2 = { type: LockType.hier, index: 2 }
                if (LockModel.ins().isLock(parm2)) {
                    ViewManager.ins().open(LockWin, parm2)
                    return
                }
                HieroglyphModel.ins().setPaintData(4)
                this.upView()
                break;
            case this.submitBtn:
                HieroglyphModel.ins().cachePaintData()
                ViewManager.ins().close(this)
                ViewManager.ins().open(HomeWin)
                break;
        }
    }

}
ViewManager.ins().reg(HieroglyphWin, LayerManager.UI_Popup);
window["HieroglyphWin"] = HieroglyphWin;
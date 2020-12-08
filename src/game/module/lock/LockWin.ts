/*
 * @Author: zhoualnglang 
 * @Date: 2020-05-30 11:28:46 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-06-22 15:48:20
 */
class LockWin extends BaseEuiView {

    public titleImg: eui.Image;
    public lockImg: eui.Image;
    public lockBtn: eui.Image;
    public closeBtn: eui.Image;

    public lockParm: { type: LockType, index, color?, win?}

    public constructor() {
        super();
        this.skinName = 'LockSkin'
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeBtn, this.onClick);
        this.addTouchEvent(this.lockBtn, this.onClick);

        if (param[0] != null) {
            this.lockParm = param[0]
        }
        else {
            this.lockParm = { type: LockType.color, index: 5, color: 0x00ff00, win: 'dress' }
        }
        this.upView()
        App.ins().playBannerAd(Ad.dialogBanner)
    }

    private upView() {
        let parm = this.lockParm
        if (parm.type == LockType.color) {
            this.titleImg.source = 'lock_title_color_png'
            this.lockImg.source = 'button_paint_fill'
            let color = parm.color
            let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getMatByColor(color));
            this.lockImg.filters = [colorFlilter]
        }
        else if (parm.type == LockType.dress) {
            this.titleImg.source = 'lock_title_dress_png'
            this.lockImg.source = 'lock_dress_png'
            this.lockImg.filters = null
        }
        else if (parm.type == LockType.hier) {
            this.titleImg.source = 'lock_title_img_png'
            this.lockImg.source = parm.index == 1 ? 'lock_img1_png' : 'lock_img2_png'
            this.lockImg.filters = null
        }
    }

    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.closeBtn:
                ViewManager.ins().close(this)
                break;
            case this.lockBtn:
                App.ins().watchAdCall(AwardType.TIP_VIDEO, (() => {
                    LockModel.ins().cacheData(this.lockParm)
                    wx.showToast({ icon: 'none', title: '解锁成功' })
                    ViewManager.ins().close(this)
                }).bind(this))
                break;
        }
    }

    public close(...param: any[]): void {
        App.ins().destoryBanner()
    }

}
ViewManager.ins().reg(LockWin, LayerManager.UI_Tips);

const enum LockType {
    color = 0,
    dress,
    hier,
}
window["LockWin"] = LockWin;
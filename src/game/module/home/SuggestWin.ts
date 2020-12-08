/* 建议 反馈
 * @Author: zhoulanglang 
 * @Date: 2020-08-11 14:17:14 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-11 15:17:42
 */
class SuggestWin extends BaseEuiView {

    private closeBtn: BaseBtn
    private btn: BaseBtn
    private editLab: eui.EditableText

    public constructor() {
        super();
        this.skinName = 'SuggestSkin'
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeBtn, this.onClick);
        this.addTouchEvent(this.btn, this.onClick);

        this.upView()
        App.ins().playBannerAd(Ad.loadingBanner)
    }

    private upView() {

    }


    public close(...param: any[]): void {
        App.ins().destoryBanner()
    }

    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.btn:
                let str = this.editLab.text
                if (str && str.length > 0) {
                    str = str.length > 100 ? str.substring(0, 100) : str
                    App.ins().reqSave(str)
                    ViewManager.ins().close(this)
                    wx.showToast({ icon: 'none', title: `已反馈` })
                }
                break;
            case this.closeBtn:
                ViewManager.ins().close(this)
                break;
        }
    }

}
ViewManager.ins().reg(SuggestWin, LayerManager.UI_Popup);
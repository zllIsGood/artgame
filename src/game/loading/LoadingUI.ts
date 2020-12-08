/* loading界面
 * @Author: zhoualnglang 
 * @Date: 2020-04-09 12:38:22 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-29 14:45:19
 */

class LoadingUI extends BaseEuiView {

    public bg: eui.Image;
    public loadingBar: eui.Rect;
    public loadingStatus: eui.Rect;

    private loadingBanner: any;
    private isLoaded = false

    public constructor() {
        super();
        this.skinName = "LoadingUISkin";
    }

    public open(...param: any[]): void {

        StageUtils.ins().adaptationIpx(this.bg)
        // this.upView()
    }

    /**开始loading*/
    public static start() {
        let view = ViewManager.ins().getView(LoadingUI) as LoadingUI
        if (view) {
            view.upView()
            App.ins().playBannerAd(Ad.loadingBanner)
        }
    }
    /**设置进度*/
    public static setLoadingState(p: number) {
        let view = ViewManager.ins().getView(LoadingUI) as LoadingUI
        if (view) {
            view.setLoadingState(p)
        }
    }

    private async upView() {
        let loading = new MyLoading(this);

        await this.loadCfg()
        let name = 'preload_main'
        RES.createGroup(name, ['preload', 'main'])
        RES.loadGroup(name, 0, loading)
        // RES.loadGroup('preload', 0, loading)
    }

    private urls = []
    private remoteNum = 0
    private preNum = 0
    private currentNum
    public next() {
        this.setLoadingState(this.currentNum / (this.preNum + this.remoteNum) * 0.7 + 0.3)
        this.currentNum++
        let source = this.urls.pop()
        if (source) {
            if (RES.hasRes(source)) {
                let data = RES.getRes(source);
                if (data) {
                    this.next()
                }
                else {
                    RES.getResAsync(source, this.next, this);
                }
            }
            else {
                RES.getResByUrl(source, this.next, this, RES.ResourceItem.TYPE_IMAGE);
            }
        }
        else {
            Main.startGame()
        }
    }

    public close(...param: any[]): void {
        App.ins().destoryBanner()
        this.isLoaded = false
    }

    public onProgress(current: number, total: number, isLast?: boolean) {

        this.setLoadingState(current / (total + this.remoteNum) * 0.7 + 0.3)
        if (current >= total) {
            console.log('加载完')
            this.preNum = total
            this.currentNum = total
            // 最后一个加载完
            // this.startGame()
            this.next()
        }
    }

    public async loadCfg() {
        // let data = await RES.getResByUrl(Main.res_url + '?' + Math.random(), null, null, RES.ResourceItem.TYPE_JSON) //确保不受缓存的影响
        await RES.loadConfig("another.res.json", App.ins().getAnotherResRoot() + 'resource/');
        this.setLoadingState(0.2)
    }

    public setLoadingState(p: number) {
        this.loadingStatus.width = p * (this.loadingBar.width - 6);
    }

    protected onComplete(): void {

    }

}
ViewManager.ins().reg(LoadingUI, LayerManager.UI_LOADING);
window["LoadingUI"] = LoadingUI;
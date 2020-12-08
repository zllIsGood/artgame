/* 导航栏
 * @Author: zhoualnglang 
 * @Date: 2020-04-11 11:03:23 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-30 17:07:44
 */
class NavigationWin extends BaseEuiView {

    public recordBtn: eui.Image;
    public recordingBtn: eui.Image;
    public recordShareBtn: eui.Image;

    public constructor() {
        super();
        this.skinName = 'NavigationSkin'
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.recordBtn, this.start);
        this.addTouchEvent(this.recordingBtn, this.stop);
        this.addTouchEvent(this.recordShareBtn, this.share);

        /*this.observe(UserModel.ins().postVideoStart, this.start)
        this.observe(UserModel.ins().postVideoStop, this.stop)
        this.observe(UserModel.ins().postVideoShare, this.share)*/

        this.upView()
    }

    private upView() {
        this.initRecorderState();
        this.initRecorder();
    }

    share() {
        RecordService.recordShare();
        this.recordShareBtn.visible = false
    }

    start() {
        if (Main.recorder) {
            Main.recording = true;
            this.recordShareBtn.visible = false
            egret.localStorage.removeItem(Constant.RECORD_SHARE_URL);
            Main.recorder.start({ duration: 120 });
        }
    }

    stop() {
        if (Main.recorder) {
            Main.recording = false;
            Main.recorder.stop();
        }
    }

    public close(...param: any[]): void {
    }

	/**
	 * 初始化录屏
	 */
    private initRecorder() {
        let self = this;
        if (Main.recorder) {
            Main.recorder.onStart(res => {
                console.log("录屏开始");
                self.recordBtn.visible = false
                self.recordingBtn.visible = true
                Main.recordStartTime = new Date().getTime();
            });
            Main.recorder.onStop(res => {
                console.log("录屏结束", res);
                self.recordBtn.visible = true
                self.recordingBtn.visible = false
                let stopTime = new Date().getTime();
                if (stopTime - Main.recordStartTime < Main.recordTime) {
                    // if (stopTime - Main.recordStartTime < 1000) {
                    // console.log("录屏时间过短");
                    wx.showToast({
                        icon: 'none',
                        title: "录屏时间过短",
                        duration: 2000
                    });
                } else if (res.videoPath) {
                    Main.recording = false;
                    this.recordShareBtn.visible = true
                    CacheUtil.set(Constant.RECORD_SHARE_URL, res.videoPath);
                }
            });
        }
    }
	/**
	 * 初始化录屏状态
	 */
    private initRecorderState() {
        if (Main.recording) {
            this.recordBtn.visible = false
            this.recordingBtn.visible = true
            this.recordShareBtn.visible = false
        } else {
            this.recordBtn.visible = true
            this.recordingBtn.visible = false
            if (CacheUtil.get(Constant.RECORD_SHARE_URL)) {
                this.recordShareBtn.visible = false //true
            } else {
                this.recordShareBtn.visible = false
            }
        }
    }


}

ViewManager.ins().reg(NavigationWin, LayerManager.UI_Tips);
window["NavigationWin"] = NavigationWin;
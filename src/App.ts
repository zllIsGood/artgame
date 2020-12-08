/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-21 11:20:05 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-06-22 11:38:05
 */
class App extends BaseClass {
    public static isPC() {
        return egret.Capabilities.os == "Windows PC"
    }

    public static ins(): App {
        return super.ins();
    }

    public constructor() {
        super();

    }

    public getResRoot() {
        if (Main.gamePlatform == Main.platformTT) {

        }
        else if (Main.gamePlatform == Main.platformApp) {

        }
        else if (Main.gamePlatform == Main.platformH5) {
            // if (window['res_root']) {
            //     return window['res_root'] + 'resource/'
            // }
        }
        return ''
    }

    public getAnotherResRoot() {
        if (Main.gamePlatform == Main.platformTT) {
            return 'https://cdnzmg.zmfamily.cn/artgame/minigame/'
        }
        else if (Main.gamePlatform == Main.platformApp) {

        }
        else if (Main.gamePlatform == Main.platformH5) {

        }
        return ''
    }

    private _deviceId: string = null // '12ff03950a2150c4'
    public get deviceId() {
        // console.log('getdeviceId:', this._deviceId)
        return this._deviceId
    }
    public set deviceId(_deviceId) {
        this._deviceId = _deviceId
    }

    public async initDeviceId() {
        return new Promise((resolve, reject) => {
            if (Main.gamePlatform == Main.platformApp) {
                Openadsdk.GetDevice((json) => {
                    console.log("GetDevice:" + json)
                    this.deviceId = '' + json
                    resolve()
                }, this, '')
            }
            else if (Main.gamePlatform == Main.platformH5) {
                let uid = ''
                if (location && location.search) {
                    let str = location.search.substring(1)
                    let parms = str.split('&')
                    for (let i in parms) {
                        let arr = parms[i].split('=')
                        if (arr[0] == 'uuid') {
                            uid = arr[1]
                        }
                    }
                }
                this.deviceId = uid
                resolve()
            }
            else {
                resolve()
            }
        })
    }

    public async login() {
        // if (Main.gamePlatform == Main.platformTT) {
        //     await WxService.login()
        // }
        // else if (Main.gamePlatform == Main.platformApp) {
        //     await wx.login()
        // }
        // else if (Main.gamePlatform == Main.platformH5) {
        //     await wx.login()
        // }
    }

    /**获取是否显示用户协议界面*/
    public getShowUserProto() {
        if (Main.gamePlatform == Main.platformApp || Main.gamePlatform == Main.platformIOS) {
            let s = CacheUtil.get(Constant.USER_PROTO)
            if (s != '1') {
                return true
            }
        }
        return false
    }
    public setShowUserProto(bool: boolean) {
        let s = bool ? '1' : '0'
        CacheUtil.set(Constant.USER_PROTO, s)
    }

    /**观看视频广告来回调*/
    public watchAdCall(awardType: number, fun: Function) {
        if (Main.gamePlatform == Main.platformTT) {
            AdService.watchAdTip(awardType, fun)
        }
        else if (Main.gamePlatform == Main.platformApp) {
            AndroidAd.Reward(awardType, fun)
        }
        else if (Main.gamePlatform == Main.platformH5) {
            ScoreService.Reward(awardType, fun)
        }
    }

    public playRewardVideoAd(awardType?) {
        if (Main.gamePlatform == Main.platformTT) {
            AdService.watchAd(awardType)
        }
        else if (Main.gamePlatform == Main.platformApp) {
            AndroidAd.Reward(awardType)
        }
        else if (Main.gamePlatform == Main.platformH5) {
            ScoreService.Reward(awardType)
        }
    }

    public playBannerAd(ad?: string) {
        if (Main.gamePlatform == Main.platformTT) {
            return AdService.createBannerAd(ad)
        }
        else if (Main.gamePlatform == Main.platformApp) {
            AndroidAd.Banner()
            return null
        }
    }

    public destoryBanner() {
        if (Main.gamePlatform == Main.platformTT) {
            AdService.destoryBanner()
        }
        else if (Main.gamePlatform == Main.platformApp) {
            AndroidAd.CloseBannerAd()
        }
    }

    public isShowShareBtn() {
        if (Main.gamePlatform == Main.platformTT) {
            let stopTime = new Date().getTime();
            if (stopTime - Main.recordStartTime > Main.recordTime) {
                return true
            }
        }
        return false
    }

    /**开屏广告 限安卓*/
    public splash() {
        if (Main.gamePlatform == Main.platformApp && this.isOpenAd()) {
            AndroidAd.Splash()
        }
    }

    /**反馈*/
    public async  reqSave(detail = 'test') {
        return new Promise((resolve, reject) => {
            if (Main.gamePlatform == Main.platformApp || Main.gamePlatform == Main.platformTT) {
                let obj = {
                    url: encodeURI(Main.host/*'http://192.168.0.63:9900'*/ + Api.SAVE_BACK),
                    data: {
                        detail: detail
                    },
                    method: 'POST',
                    success: (res) => {
                        console.log("request success!", res);
                        if (res.data.data) {

                        }
                        resolve()
                    },
                    fail: (res) => {
                        console.log("request fail!", res);
                        resolve()
                    }
                }
                wx.request(obj)
            }
            else {
                resolve()
            }
        })
    }

    private _openAd = false // true // false
    public setOpenAd(bool) {
        this._openAd = bool ? true : false
    }
    /**广告是否开启 过审时会关闭*/
    public isOpenAd() {
        return this._openAd
        // 0关闭 1开启
        // let watchAdType = Main.energyConfig ? Main.energyConfig.watchAdType : 0
        // if (watchAdType > 0) {
        //     return true
        // }
        // return false
    }

    /**false为积分 true未广告*/
    public adNotScore() {
        if (Main.gamePlatform == Main.platformH5) {
            return false
        }
        return true
    }
}
window["App"] = App;
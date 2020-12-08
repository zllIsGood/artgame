/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-21 14:34:06 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-06-22 15:43:44
 */
class AndroidAd {
    /**记录当前奖励类型*/
    private static awardType: number;
    private static videoCallback: Function

    private static async videoResult(deley = true) {
        if (deley) {
            await TimerManager.ins().deleyPromisse(3000)
        }
        if (this.awardType === AwardType.LOGIN_AWARD) {
            // 登录奖励，观看视频翻倍
            AdService.loginAward(true);
        } else if (this.awardType === AwardType.WATCH_AD_AWARD) {
            // 观看广告奖励
            AdService.watchAdAward();
        } else if (this.awardType == AwardType.TIP_VIDEO) {
            if (this.videoCallback) {
                this.videoCallback()
                this.videoCallback = null
            }
        }
    }

    public static Splash() {
        //开屏广告
        Openadsdk.SplashAd(() => { }, this, "");
    }

    public static Reward(awardType, fun?) {
        this.awardType = awardType
        if (awardType == AwardType.TIP_VIDEO) {
            this.videoCallback = fun
        }
        if (!App.ins().isOpenAd()) {
            AndroidAd.videoResult(false)
            return
        }
        //激励广告
        const data = {
            is_horizontal: false,
            userID: "user0",
            rewardAmount: 1,
            rewardName: "体力"
        }
        Openadsdk.RewardVideoAd((json) => {
            console.log("激励广告事件:" + json)
            const data = JSON.parse(json);
            if (data.event === "onRewardVerify") {
                const verify = data.verify;//是否有效
                const amount = data.amount;//奖励数量
                const name = data.name;//奖励名称
                console.log(data)
            } else if (data.event === "onAdShow") {
                console.log("广告显示")
            } else if (data.event === "onAdVideoBarClick") {
                console.log("点击banner")
            } else if (data.event === "onAdClose") {
                console.log("关闭广告")
                AndroidAd.videoResult()
            } else if (data.event === "onVideoComplete") {
                console.log("视频播放完毕")
            } else if (data.event === "onVideoError") {
                console.log("视频播放错误")
            } else if (data.event === "onSkippedVideo") {
                console.log("跳过")
            }
        }, this, JSON.stringify(data))
    }

    public static FullScreen() {
        //全屏广告
        const data = {
            is_horizontal: false,
        }
        Openadsdk.FullScreenVideoAd((json) => {
            console.log("全屏广告事件:" + json)
        }, this, JSON.stringify(data))
    }

    public static Banner() {
        if (!App.ins().isOpenAd()) {
            return
        }
        //banner广告
        const data = {
            is_top: false,
            width: 600,
            height: 150
        }
        Openadsdk.BannerExpressAd((json) => {
            console.log("banner广告事件:" + json)
        }, this, JSON.stringify(data))
    }

    public static CloseBannerAd() {
        if (!App.ins().isOpenAd()) {
            return
        }
        Openadsdk.CloseBannerAd()
    }

    public static Interaction() {
        //插屏广告
        const data = {
            width: 900,
            height: 900
        }
        Openadsdk.InteractionAd((json) => {
            console.log("插屏广告事件:" + json)
        }, this, JSON.stringify(data))
    }

}
window["AndroidAd"] = AndroidAd;
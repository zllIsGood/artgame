/* h5积分换体力
 * @Author: zhoualnglang 
 * @Date: 2020-04-29 17:26:50 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-29 12:25:07
 */
class ScoreService {
    /**记录当前奖励类型*/
    private static awardType: number;
    private static videoCallback: Function

    private static videoResult() {
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

    public static Reward(awardType, fun?) {
        this.awardType = awardType
        if (awardType == AwardType.TIP_VIDEO) {
            this.videoCallback = fun
        }
        // if (!App.ins().isOpenAd()) {
        //     this.videoResult()
        //     return
        // }
        let token = AndroidJs.getToken()
        let obj = {
            url: encodeURI(Main.host + Api.EXCHANGE_ENERGY),
            data: {
                // gameType: 2, // 1=绘画  2=单词喵
                token: token
            },
            method: 'GET',
            success: (res) => {
                console.log("request success!", res);
                if (res.statusCode === 200 && res.data.code == 0) {
                    ScoreService.videoResult()
                }
                else {
                    wx.showToast({ title: '积分不足' })
                }
            },
            fail: (res) => {
                console.log("request fail!", res);
            }
        }
        wx.request(obj)
    }

    /**获取换体力所需积分*/
    public static getScoreNeed() {
        let num = Main.energyConfig.pointsExchangeCost
        let ret = num == null ? '' : String(num)
        return ret
    }
}
declare let AndroidJs
// if (!window['AndroidJs']) {
//     console.log('AndroidJs 不存在')
//     let AndroidJs = {
//         getToken: () => {
//             return 'token:572701782376062976'
//         }
//     }
//     window['AndroidJs'] = AndroidJs
// }
window["ScoreService"] = ScoreService;
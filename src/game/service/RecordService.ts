/**
 * 顶部导航公共组件
 * @author kei
 * @since 2020-03-04
 */
class RecordService {

    /**
	 * 录屏分享
	 */
    public static recordShare() {
        let videoPath = CacheUtil.get(Constant.RECORD_SHARE_URL);
        egret.localStorage.removeItem(Constant.RECORD_SHARE_URL);
        if (videoPath) {
            console.log("分享录屏！", videoPath);
            let query = JSON.stringify({ shareVideo: true })
            wx.shareAppMessage({
                channel: "video",
                // title: "单词喵",
                // desc: "快来跟我一起拼单词收集喵星人吧",
                // imageUrl: Main.shareConfig.common.imageUrl,
                // templateId: Main.ttShareId,
                query: query,
                extra: {
                    videoPath: videoPath, // 可替换成录屏得到的视频地址
                    videoTopics: [" 我发现了一款好玩的拼单词游戏，快来跟我一起玩吧"],
                    withVideoId: true
                },
                success(res) {
                    console.log("分享录屏成功！增加体力", res);
                    // AdService.shareVideoAward();
                },
                fail(err) {
                    console.log("分享失败！", err);
                    wx.showToast({
                        icon: 'none',
                        title: "取消分享",
                        duration: 2000
                    })
                }
            })
        }
        else {
            console.log('录屏分享已失效')
            // wx.showToast({
            //     icon: 'none',
            //     title: "录屏分享已失效",
            //     duration: 2000
            // })
        }
    }

}
window["RecordService"] = RecordService;
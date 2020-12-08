/* 适配h5版http
 * @Author: zhoualnglang 
 * @Date: 2020-04-07 10:01:38 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-06-22 15:46:26
 */
if (!window['wx']) {
    window['wx'] = {
        login: async function () {
            return RequestUtil.postPromise({
                url: encodeURI(Main.host + Api.USER_LOGIN),
                data: {
                    appUid: App.ins().deviceId,
                }
            }).then(res => {
                // if (res.code === 0 && StringUtil.isNotBlank(res.data.token)) {
                //     let loginRes = res.data;
                //     Main.isLogin = true;
                //     Main.userData = loginRes.gameData.userData;
                //     Main.sageList = loginRes.gameData.sageList;
                //     Main.energyConfig = loginRes.gameData.energyConfig;
                //     LoginUtil.setToken(loginRes.token);
                //     LoginUtil.setUserId(loginRes.userId);
                //     return true;
                // } else {
                //     console.error("登录请求失败!", res);
                //     wx.showToast({ icon: 'none', title: "登录失败请重试" });
                //     return false;
                // }
            })
        },
        request: function (params) {
            console.log('WxH5:', JSON.stringify(params))
            if (params.method == 'GET') {
                Http.ins().get(params)
            }
            else if (params.method == 'POST') {
                Http.ins().post(params)
            }
        },
        showToast: function (obj: { icon?, title?: string, duration?: number }) {
            // console.log('showToast:', obj)
            TipModel.ins().show(obj)
        },
        showLoading: function (obj) {
            console.log(obj)
        },
        hideLoading: function () {
            //
        },
    }
}
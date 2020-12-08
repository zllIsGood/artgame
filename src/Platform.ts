/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface WxApi {
    login(): Promise<any>;
    getSystemInfo(): Promise<any>;
    onShow(callback: Function, obj: any): Promise<void>;
    downloadFile(url: string): Promise<any>;
    getStorage(key: string): Promise<any>;
}

class DebugPlatform implements WxApi {
    async login() {
        return new Promise((resolve, reject) => {
            wx.login({
                force: false,
                success(res) {
                    console.log(`wx.login调用成功${res.code} ${res.anonymousCode}`);
                    resolve(res);
                },
                fail(err) {
                    reject({ msg: "login fail!", err: err })
                }
            })
        });
    }

    async getSystemInfo() {
        return new Promise((resolve, reject) => {
            wx.getSystemInfo({
                success(res) {
                    resolve(res);
                },
                fail(err) {
                    reject({ msg: "getSystemInfo fail!", err: err });
                }
            });
        });
    }

    async onShow(callback: Function, obj: any) {
        wx.onShow(() => {
            callback.call(obj);
        });
    }

    async downloadFile(url: string) {
        return new Promise((resolve, reject) => {
            wx.downloadFile({
                url: url,
                success(res) {
                    resolve(res);
                }
            });
        });
    }

    async getStorage(key) {
        return new Promise((resolve, reject) => {
            wx.getStorage({
                key: key,
                success(res) {
                    resolve(res.data);
                },
                fail(err) {
                    reject(err);
                }
            });
        });
    }
}


if (!window.wxapi) {
    window.wxapi = new DebugPlatform();
}



declare let wxapi: WxApi;

declare interface Window {

    wxapi: WxApi
}


declare let platform: WxApi;

declare interface Window {

    platform: WxApi
}



window["DebugPlatform"] = DebugPlatform;
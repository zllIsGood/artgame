/**
 * 请求操作工具
 * @author kei
 * @since 2019-03-01
 */
class RequestUtil {

    public static get(params): void {
        // console.log("发起get请求：", params);
        params.method = "GET";
        RequestUtil.doRequest(params);
    }

    public static post(params): void {
        // console.log("发起post请求：", params);
        params.method = "POST";
        RequestUtil.doRequest(params);
    }

    public static put(params): void {
        // console.log("发起put请求：", params);
        params.method = "PUT";
        RequestUtil.doRequest(params);
    }

    public static getPromise(params): Promise<any> {
        params.method = "GET";
        return this.doRequestPromisse(params);
    }

    public static postPromise(params): Promise<any> {
        // console.log("发起POST请求：", params);
        params.method = "POST";
        return this.doRequestPromisse(params);
    }

    private static doRequest(params) {
        params = RequestUtil.setHeader(params);
        let success = params.success;
        let fail = params.fail;
        params.success = (res) => {
            console.log("request!", params, res);
            if (res.statusCode === 200) {
                if (success) {
                    success(res.data);
                }
            } else {
                if (fail) {
                    fail(res);
                }
            }
        };
        wx.request(params);
    }

    private static doRequestPromisse(params): Promise<any> {
        return new Promise((resolve, reject) => {
            params = RequestUtil.setHeader(params);
            params.success = (res) => {
                console.log("request!", params, res)
                if (res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            };
            params.fail = (err) => {
                reject(err);
            };
            wx.request(params);
        });
    }

    /**
     * 设置header
     */
    private static setHeader(params) {
        params.timeout = Main.reqTimeout;
        let token = LoginUtil.getToken();
        let userId = LoginUtil.getUserId();
        console.log(`platform=${Main.gamePlatform}`, `token=${token}`, `userId=${userId}`);
        let header = ObjectUtil.isNull(params.header) ? {} : params.header;
        if (StringUtil.isNotBlank(token)) {
            header.zmgToken = token;
            header.zmgUserId = String(userId); //必须->string  android包对number支持不了
        }
        header.zmgPlatform = Main.gamePlatform;
        header.zmgVersion = Main.version;
        params.header = header;
        return params;
    }

}
window["RequestUtil"] = RequestUtil;
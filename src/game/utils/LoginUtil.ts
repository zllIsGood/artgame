/**
 * 登录操作工具
 * @author kei
 * @since 2019-03-01
 */
class LoginUtil {
    public static _token = null
    public static setToken(token: string): void {
        if (token) {
            // CacheUtil.set(Constant.LOGIN_TOKEN, token);
            this._token = token
        }
    }

    public static getToken(): string {
        // return CacheUtil.get(Constant.LOGIN_TOKEN);
        return this._token
    }

    public static setUserId(userId: number): void {
        if (userId) {
            CacheUtil.set(Constant.LOGIN_USER_ID, userId + "");
        }
    }

    public static getUserId(): number {
        let data = CacheUtil.get(Constant.LOGIN_USER_ID);
        if (data) {
            return Number(data);
        }
    }

}
window["LoginUtil"] = LoginUtil;
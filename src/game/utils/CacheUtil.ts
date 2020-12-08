/**
 * 缓存工具
 * @author kei
 * @since 2020-02-12
 */
class CacheUtil {
    private static _cache: any = {}

    public static set(key: string, value: string) {
        // console.log('egret.localStorage.setItem')
        egret.localStorage.setItem(key, value)
        // this._cache[key] = value
    }

    public static get(key: string): string {
        // console.log('egret.localStorage.getItem')
        return egret.localStorage.getItem(key)
        // return this._cache[key]
    }

}
window["CacheUtil"] = CacheUtil;
/**
 * 参数操作工具
 * @author kei
 * @since 2019-01-28
 */
class StringUtil {

    public static isBlank(str: string) {
        return str === null || str === undefined || str === "";
    }

    public static isNotBlank(str: string) {
        return str !== null && str !== undefined && str !== "";
    }

    public static getImgByNumber(n: number) {
        let arr = []
        if (n > 0) {
            let str = n.toString()
            for (let i = 0; i < str.length; i++) {
                arr.push(`number_${str[i]}_png`)
            }
        }
        return arr
    }

    public static imgNumbers = ['']
}
window["StringUtil"] = StringUtil;
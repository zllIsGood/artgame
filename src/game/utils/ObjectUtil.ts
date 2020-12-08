/**
 * 参数操作工具
 * @author kei
 * @since 2019-01-28
 */
class ObjectUtil {

    public static isNull(obj: any) {
        return obj == null || obj == undefined;
    }

    public static isNotNull(obj: any) {
        return obj != null && obj != undefined;
    }
}
window["ObjectUtil"]=ObjectUtil;

class DateUtil {
    /**秒*/
    public static getUnixtime(): number {
        return new Date().getTime() / 1000;
    }

    public static getDayStart(): number {
        return Date.parse(new Date().toDateString()) / 1000;
    }

}
window["DateUtil"] = DateUtil;
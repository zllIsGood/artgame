/* 接口
 * @Author: zhoualnglang 
 * @Date: 2020-03-31 19:25:45 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-29 17:38:48
 */
class Api {
    //反馈
    public static SAVE_BACK = "/user/feedback/save";

    // 用户
    public static USER_LOGIN = "/word/user/login";
    public static USER_GET_USER_DATA = "/word/user/getUserData";
    public static USER_WATCH_AD = "/word/user/watchAd";
    public static USER_SHARE_VIDEO = "/word/user/shareVideo";
    public static USER_SHARE_PROGRAM = "/word/user/shareProgram";
    public static USER_LOGIN_AWARD = "/word/user/loginAward";
    public static USER_REFRESH = "/word/user/refresh";

    // 关卡相关
    public static STAGE_PLAY = "/word/stage/play"; //闯关
    public static STAGE_FINSH = "/word/stage/finish";
    public static STAGE_TIPS = "/word/stage/tips";
    public static STAGE_WORD = "/word/stage/queryWord";
    public static STAGE_NEXTUPGRADE = "/word/stage/nextUpGrade";

    //主角
    public static PERSION_UPPERSION = "/word/person/upgradePerson";
    public static PERSION_GET = "/word/person/getPerson";
    public static PERSION_PAGE = "/word/person/pagePerson";

    //房子
    public static HOUSE_UP = "/word/house/upgradeHouse";
    public static HOUSE_GET = "/word/house/getHouse";
    public static HOUSE_PAGE = "/word/house/pageHouse";

    //招贤
    public static HERO = "/word/sage/recruit";
    public static HERO_GET = "/word/sage/getSage";
    public static HERO_PAGE = "/word/sage/pageSage";
    public static HERO_LIST = "/word/sage/listSage";
    public static HERO_GROUP_AWARD = "/word/sage/drawSageReward";
    public static HERO_GROUP_HASAWARD = "/word/sage/getHasDraw";
    public static HERO_UP_LEVEL = "/word/sage/upgrade";

    //词典
    // public static WORD_QUERY = "/word/dict/query";
    public static WORD_ADD = "/word/wordBook/add";
    public static WORD_CHANGESTATE = "/word/wordBook/changeState";
    public static WORD_LIST = "/word/wordBook/list";
    public static WORD_DETAIL = "/word/wordBook/detail";
    public static WORD_ERR = "/word/wordBook/wrongWord";

    //h5积分换体力
    public static EXCHANGE_ENERGY = "/word/user/exchangeEnergy";
}
window["API"] = Api;
window["Api"] = Api;
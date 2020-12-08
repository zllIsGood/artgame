/*
 * @Author: zhoualnglang 
 * @Date: 2020-03-31 11:27:54 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-22 15:05:35
 */
class GlobalConfig {

    public static init(data) {
        console.log(data)
        this.config = data
    }

    public static config: {
        CoursePlay: string[],
        HeroResult: { url, x, y },
        hammer: { url, x, y },
    }

    public static getCoursePlay() {
        return this.config.CoursePlay
    }

    public static getHeroResult() {
        return this.config.HeroResult
    }

    public static getUpHouseMc() {
        return this.config.hammer
    }

    public static shareImgUrl = './resource/assets/other/share_cover.png'
    public static helpImgUrl = './resource/assets/other/help_cover.png'
}
window["GlobalConfig"] = GlobalConfig
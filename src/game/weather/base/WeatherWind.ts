/* 风
 * @Author: zhoualnglang 
 * @Date: 2020-05-28 10:34:21 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-28 12:37:24
 */
class WeatherWind {

	/**
	 * prepare
	 */
    protected r_P_List: WindMC[] = [];

	/**
	 * running
	 */
    protected r_R_List: WindMC[] = [];

    public MAX_COUNT: number = 12; //this.xN*this.xN
    /**粒子最大数量*/
    protected r_Max: number = 12; //this.xN*this.xN
    private xN = 3  //列数
    private yN = 4  //行数

    public constructor() {
        this.onWeatherStart()
    }

    public playWeather() {
        this.onWeatherUpdate()
    }

    public stopWeather() {
        this.onWeatherStop()
    }

    protected onWeatherStart(): void {
        if (this.r_P_List.length == 0 && this.r_R_List.length == 0) {//粒子未初始化，则初始化粒子数量max
            var mc: WindMC;
            for (var i: number = 0; i < this.MAX_COUNT; i++) {
                mc = new WindMC();
                this.r_P_List.push(mc);
            }
        }
    }

    protected onWeatherUpdate(): void {
        let view = ViewManager.ins().getView(HieroglyphWin) as HieroglyphWin
        let map = view.map;
        let xN = this.xN
        let yN = this.yN
        let w = map.width / xN
        let h = map.height / yN

        for (let i = 0; i < xN; i++) {
            for (let j = 0; j < yN; j++) {
                let mc = this.r_P_List[i + j * xN]
                if (mc) {
                    mc.x = MathUtils.limitInteger(0, w / 2) + i * w
                    mc.y = MathUtils.limitInteger(0, h / 2) + j * h
                    mc.addParent(map)
                    this.r_R_List.push(mc)
                }
            }
        }
    }

    resetItem(mc: WindMC) {
        let index = this.r_P_List.indexOf(mc)
        let view = ViewManager.ins().getView(HieroglyphWin) as HieroglyphWin
        let map = view.map;
        let xN = this.xN
        let yN = this.yN
        let w = map.width / xN
        let h = map.height / yN

        let i = index % yN
        let j = Math.floor(index / xN)
        mc.x = MathUtils.limitInteger(0, w / 2) + i * w
        mc.y = MathUtils.limitInteger(0, h / 2) + j * h
        mc.addParent(map)
    }

    protected onWeatherStop(): void {//回收静止和活跃的粒子
        for (let i in this.r_R_List) {
            let mc = this.r_R_List[i]
            DisplayUtils.removeFromParent(mc)
        }
        this.r_R_List.length = 0
    }

}
window["WeatherWind"] = WeatherWind;
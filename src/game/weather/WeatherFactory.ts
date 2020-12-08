class WeatherFactory {
	public static enabled: Boolean = false;

	public static weatherFBList = [];

	public static weatherSceneList = [];

	/**
	 * 刷新频率
	 */
	public static frequency: number;
	public static weatherRunlist: Object = new Object();

	private static _weatherRain: WeatherRain;
	private static _weatherWind: WeatherWind;

	/**当前天气 */
	private static _currWeather: WeatherBase;

	public static stopWeather(): void {
		if (this._currWeather) {
			this._currWeather.stopWeather();
		}
	}

	/**获取一个天气对象 并会赋值成当前天气对象
	 * 0: 没效果
	 * 1：雨
	 * 2: 风
	 */
	public static getWeather(type: number): WeatherBase {
		if (type == 1) {
			this._currWeather = this.getRain();
		}
		return this._currWeather;
	}

	/**
	 * 雨天
	 * @return 
	 * 
	 */
	private static getRain(): WeatherRain {
		this._weatherRain = this._weatherRain || new WeatherRain();
		return this._weatherRain;
	}

	/**
		 * 
		 * @return 
		 * 
		 */
	public static getWind(): WeatherWind {
		this._weatherWind = this._weatherWind || new WeatherWind();
		return this._weatherWind;
	}
}
window["WeatherFactory"] = WeatherFactory;
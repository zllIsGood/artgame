
/**
 * 颜色相关处理工具
 */
class ColorUtil {
	/**发光滤镜*/
	public static getGlowFilter(color: number = 0x33CCFF) {
		///color 光晕的颜色，十六进制，不包含透明度
		let alpha: number = 0.8;             /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
		let blurX: number = 35;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
		let blurY: number = 35;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
		let strength: number = 2;            /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
		let quality: number = egret.BitmapFilterQuality.HIGH;        /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
		let inner: boolean = false;            /// 指定发光是否为内侧发光，暂未实现
		let knockout: boolean = false;            /// 指定对象是否具有挖空效果，暂未实现
		let glowFilter: egret.GlowFilter = new egret.GlowFilter(color, alpha, blurX, blurY,
			strength, quality, inner, knockout);
		return glowFilter
	}
	/**获取填充色对应的滤镜  偏移量color=0xffffff  或 color="0xffffff" */
	public static getTintFilter(color: number | string, alpha: number = 0.5) {
		color = typeof color == 'string' ? Number(color) : color
		let rgb = this.getRgb(color)
		let alpha2 = 1 - alpha
		let ret = [
			alpha2, 0, 0, 0, rgb[0] * alpha,
			0, alpha2, 0, 0, rgb[1] * alpha,
			0, 0, alpha2, 0, rgb[2] * alpha,
			0, 0, 0, 1, 0
		]
		return ret
	}
	/**获取颜色对应的滤镜  color=0xffffff  或 color="0xffffff" */
	public static getMatByColor(color: number | string) {
		color = typeof color == 'string' ? Number(color) : color
		let rgb = this.getRgb(color)
		let ret = [
			0, 0, 0, 0, rgb[0],
			0, 0, 0, 0, rgb[1],
			0, 0, 0, 0, rgb[2],
			0, 0, 0, 1, 0
		]
		return ret
	}

	/**[r,g,b]*/
	public static getRgb(color: number) {
		let rgb = [(color & 0xff0000) >> 16, (color & 0xff00) >> 8, color & 0xff]
		return rgb
	}

	/**
	 * 合并颜色值
	 */
	public static mergeRGB($r: number, $g: number, $b: number): number {
		return ($r << 16) | ($g << 8) | $b;
	}


	/**
	 * 合并颜色值
	 */
	public static mergeARGB($a: number, $r: number, $g: number, $b: number): number {
		return ($a << 24) | ($r << 16) | ($g << 8) | $b;
	}


	/**
	 * 颜色值表示法转换number转String
	 * @param $number 需要转换的number值
	 * @param $prefix 字符串前缀
	 */
	public static numberToString($number: number, $prefix: String = "#"): String {
		return $prefix + $number.toString(16);
	}

}


window["ColorUtil"] = ColorUtil
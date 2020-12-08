class RainLine extends eui.Image {

	/**
	 * 是否自动旋转
	 */
	public autoRotation: boolean = true;

	/**
	 * 自转增量
	 */
	public rotationPlus: number;

	/**
	 * x方向加速度
	 */
	public sptx: number = 0;

	/**
	 * x轴速度
	 */
	public speedx: number = 0;

	/**
	 * y轴速度
	 */
	public speedy: number = 0;

	public rotationH = 0
	public rotationS = 0
	public dRotation = -5

	/**
	 * 粒子类型（0表示移动类型，1表示旋转类型）
	 */
	public type: number;

	public isDeath: boolean;

	private spt: number = 0;
	public constructor() {
		super();
		this.touchEnabled = false;
		// this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
	}

	private onRemoveFromStage() {
		this.isDeath = true;
	}

	/**更新
	 * @param {boolean} 是否使用 参数进行X轴变化
	 */
	public update(useSpt: boolean = true): void {
		this.spt += this.sptx;
		var tx: number = this.x + this.speedx + (useSpt ? Math.cos(this.spt) * 2 : 0);
		var ty: number = this.y + this.speedy;

		this.x = tx;
		this.y = ty;
		if (this.type == 0) {
			if (this.autoRotation) {
				var angle: number = -(Math.atan2(tx - this.x, ty - this.y) * 180) / Math.PI + 90;
				this.rotation = angle;
			}

		}
		else {
			let dr = this.rotation - this.rotationS
			if (dr >= 45) {
				this.dRotation = -this.dRotation
				this.rotation = this.rotation + this.dRotation
			}
			else if (dr <= -45) {
				this.dRotation = -this.dRotation
				this.rotation = this.rotation + this.dRotation
			}
			else {
				this.rotation = this.rotation + this.dRotation
			}
		}
		let view = ViewManager.ins().getView(HieroglyphWin) as HieroglyphWin
		let map = view.map;
		this.isDeath = (this.x <= map.x || this.y <= map.y || this.x >= map.x + map.width || this.y >= map.y + map.height + this.rotationH);

	}

}
window["RainLine"] = RainLine;
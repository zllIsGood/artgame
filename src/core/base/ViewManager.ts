/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-13 15:43:51 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-13 15:45:07
 */
class ViewManager extends BaseClass {
	/**
	 * 已注册的UI信息
	 */
	private _regesterInfo: any;
	/**
	 * ui实体
	 */
	private _views: any;

	private _hCode2Key: any;
	/**
	 * 开启中UI
	 */
	private _opens: Array<string>;
	/**
	 * 常驻界面
	 */
	private _constView: string[];

	/**
	 * 构造函数
	 */
	public constructor() {
		super();
		this._regesterInfo = {};
		this._views = {};
		this._hCode2Key = {};
		this._opens = [];
		this._constView = [/*"GameSceneView", "ChatMainUI", "UIView2", "TipsView", "PlayFunView"*/];
	}

	/** 重载单例*/
	public static ins(): ViewManager {
		return super.ins() as ViewManager
	}

	/**
	 * 清空处理
	 */
	private clear(): void {
		this.closeAll();
		this._views = {};
	}

	/**
	 * 面板注册
	 * @param view 面板类
	 * @param layer 层级
	 */
	public reg(viewClass: any, layer: BaseSpriteLayer): void {
		if (viewClass == null) {
			return;
		}
		let keys: string = egret.getQualifiedClassName(viewClass);
		if (this._regesterInfo[keys]) {
			console.warn('重复注册界面：' + keys)
			return;
		}
		this._regesterInfo[keys] = [viewClass, layer];
	}

	/**
	 * 销毁一个面板
	 * @param hCode
	 */
	public destroy(hCode: number): void {
		let keys: number = this._hCode2Key[hCode];

		let view = this._views[keys];

		if (view instanceof BaseView) {

			let viewStack = view["viewStack"];
			if (viewStack && viewStack.$children.length > 0) {
				let childrens = viewStack.$children;
				childrens.forEach((value, index) => {
					if (value["close"]) {
						value["close"]();
					}
				});
			}
		}

		delete this._views[keys];
		delete this._hCode2Key[hCode];
	}

	private getKey(nameOrClass: any): string {
		let key: string = "";
		if (typeof (nameOrClass) == "string")//类名
			key = nameOrClass;
		else if (typeof (nameOrClass) == "function")//构造函数
			key = egret.getQualifiedClassName(nameOrClass);
		else if ((nameOrClass) instanceof BaseEuiView) {
			let keys = Object.keys(this._views);
			for (let i: number = 0, len = keys.length; i < len; i++) {
				let tempKey: string = keys[i];
				if (this._views[tempKey] == nameOrClass) {
					key = tempKey;
					break;
				}
			}
		}
		else
			debug.log("打开界面只支持类名和类名的字符串形式,关闭界面只支持类名和类名的字符串以及类的实例形式,错误编号:" + nameOrClass);
		return key;
	}

	/**
	 * 检测能否开启
	 * @param key 类名
	 */
	public viewOpenCheck(key: string, ...param: any[]): boolean {
		let result: boolean = true;
		let info: any[] = this._regesterInfo[key];
		if (info != null) {
			let c: any = info[0];
			let f: Function = c["openCheck"] as Function;
			if (f != null) {
				result = f(...param);
			}
		}
		return result;
	}

	/**
	 * 统一打开窗口函数
	 * @param nameOrClass 类名,类字符串名,或者类对象
	 * @param param 打开窗口传入的参数
	 *  */
	public open(nameOrClass: any, ...param: any[]): BaseEuiView {
		let key = this.getKey(nameOrClass);

		//检测能否开启
		if (!this.viewOpenCheck(key, ...param)) {
			return null;
		}

		let view: BaseEuiView = this.openEasy(key, param);
		// if (view) {
		// 	// debug.log("成功打开窗口:" + key);
		// } else {
		// 	// debug.log("成功打开窗口:" + key);
		// }
		return view;
	}

	//简单的打开一个界面
	public openEasy(nameOrClass: any, param: any[] = null): BaseEuiView {
		let keys: string = this.getKey(nameOrClass);
		let view: BaseEuiView = this._views[keys];
		let info: any[] = this._regesterInfo[keys];
		if (!view) {
			// if (!DEBUG && Assert(info, `ViewManager.openEasy class ${keys} is null!!`)) {
			// 	return;
			// }
			//参数参考this.register函数
			view = new info[0]();
			// view.$setParent(info[1]);
			this._views[keys] = view;
			this._hCode2Key[view.hashCode] = keys;
		}
		if (view == null) {
			Log.trace("UI_" + keys + "不存在");
			return null;
		}

		//关闭互斥窗口
		for (let exclusionWin of view.exclusionWins) {
			this.closeEasy(exclusionWin);
		}

		if (view.isShow() || view.isInit()) {
			view.addToParent(info[1]);
			view.open.apply(view, param);
		} else {
			// EasyLoading.ins().showLoading();
			view.loadResource(function () {
				view.addToParent(info[1]);
				view.setVisible(false);
			}.bind(this), function () {
				view.initUI();
				view.initData();
				view.open.apply(view, param);
				view.setVisible(true);
				// EasyLoading.ins().hideLoading();
			}.bind(this));
		}

		let index = this._opens.indexOf(keys);
		if (index >= 0) {
			this._opens.splice(index, 1);
		}
		this._opens.push(keys);

		return view;
	}

	//----------------------------------------------------关闭-------------------------------------
	/**
	 * 统一关闭窗口函数
	 * @param nameOrClass 类名,类字符串名,或者类对象
	 * @param param 关闭传入的参数
	 **/
	public close(nameOrClass: any, ...param: any[]): void {
		this.closeEx(nameOrClass, param);
	}

	private closeEx(className: string, ...param: any[]) {
		let view: BaseEuiView = this.getView(className);
		if (!view) return;
		view.closeEx(() => {
			let view: BaseEuiView = this.closeEasy(className, param);
			// if (view) {
			// 	// console.log("成功关闭窗口" + key);
			// } else {
			// 	// console.log("窗口不存在" + key);
			// }
		});

	}

	//简单关闭一个窗口
	private closeEasy(nameOrClass: any, ...param: any[]): BaseEuiView {
		if (!this.isShow(nameOrClass)) {
			return null;
		}
		let key: string = this.getKey(nameOrClass);
		let view: BaseEuiView = this.getView(key);
		if (view) {
			let viewIndex = this._opens.indexOf(key);
			if (viewIndex >= 0) {
				this._opens.splice(viewIndex, 1);
			}
			view.close.apply(view, param);
			view.$onClose.apply(view);
			view.removeFromParent();
		}
		return view;
	}

	/**
	 * 获取一个UI对象
	 * 返回null代表未初始化
	 * @param nameOrClass  类名,类字符串名,或者类对象
	 * @returns BaseEuiView
	 */
	public getView(nameOrClass: any): BaseEuiView {
		let keys: string = this.getKey(nameOrClass);
		// if (this._views[keys] instanceof Array)
		// 	return null;
		return this._views[keys];
	}

	/**
	 * 关闭所有开启中的UI
	 */
	public closeAll(): void {
		while (this._opens.length) {
			this.closeEasy(this._opens[0], []);
		}
		this.destroyAllNotShowView();
	}

	/**
	 * 检测一个UI是否开启中
	 * @param nameOrClass 类名,类字符串名,或者类对象
	 * @returns {boolean}
	 */
	public isShow(nameOrClass: any): boolean {
		return this._opens.indexOf(this.getKey(nameOrClass)) >= 0;
	}

	/**
	 * 释放所有已关闭但未释放的窗口
	 */
	public destroyAllNotShowView() {
		for (let code in this._hCode2Key) {
			let keys = this._hCode2Key[code];
			if (this._constView.indexOf(keys) == -1 && this._opens.indexOf(keys) == -1) {
				let win: BaseEuiView = this.getView(keys);
				if (win && win.destoryView) {
					win.destoryView(false);
				}
			}
		}
	}

	// public adaptationIpx(): void {
	// 	let imageUp = new eui.Image();
	// 	imageUp.fillMode = egret.BitmapFillMode.REPEAT;
	// 	imageUp.width = StageUtils.ins().getWidth();
	// 	imageUp.height = 80;
	// 	imageUp.source = "line_uptop_png";
	// 	imageUp.anchorOffsetY = 80;
	// 	imageUp.x = 0;
	// 	imageUp.y = 0;
	// 	imageUp.left = 0;
	// 	imageUp.right = 0;
	// 	LayerManager.UI_LOADING.addChild(imageUp);


	// 	let imageDown = new eui.Image();
	// 	imageDown.fillMode = egret.BitmapFillMode.REPEAT;
	// 	imageDown.source = "line_downbelow_png";
	// 	imageDown.width = StageUtils.ins().getWidth();
	// 	imageDown.height = 100;
	// 	imageDown.x = 0;
	// 	imageDown.y = 0;
	// 	imageDown.left = 0;
	// 	imageDown.right = 0;
	// 	imageDown.bottom = -100;
	// 	LayerManager.UI_LOADING.addChild(imageDown);
	// }
}

window["ViewManager"] = ViewManager
/**
 * 游戏场景
 */
class MainScene extends BaseScene {
	/**
	 * 构造函数
	 */
	public constructor() {
		super();
	}

	/**
	 * 进入Scene调用
	 */
	public onEnter(): void {
		super.onEnter();

		// this.addLayerAt(LayerManager.Game_Bg, 1);

		// this.addLayerAt(LayerManager.Game_Main, 2);

		// this.addLayer(LayerManager.Main_View);
		this.addLayer(LayerManager.UI_Main);
		this.addLayer(LayerManager.UI_Main2);
		this.addLayer(LayerManager.UI_Popup);
		this.addLayer(LayerManager.UI_Tips);
		this.addLayer(LayerManager.UI_LOADING);

		// if (adapterIphoneX()) {
		// 	ViewManager.ins().adaptationIpx();
		// }

		// ViewManager.ins().open(HomeWin);
		ViewManager.ins().open(LoadingUI);
		if (App.ins().getShowUserProto()) {
			ViewManager.ins().open(UserProtoWin);
		}
	}

	/**
	 * 退出Scene调用
	 */
	public onExit(): void {
		super.onExit();
	}
}

window["MainScene"] = MainScene
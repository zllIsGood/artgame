/**
 * Created by yangsong on 2014/11/24.
 * 显示对象工具类
 */
class DisplayUtils {

	/**设置比例*/
	public static setScale(e: egret.DisplayObject, scale: number) {
		e.scaleX = e.scaleY = scale
	}

	/**
	 * 创建一个Bitmap
	 * @param resName resource.json中配置的name
	 * @returns {egret.Bitmap}
	 */
	public static createBitmap(resName: string): egret.Bitmap {
		let result: egret.Bitmap = new egret.Bitmap();
		let texture: egret.Texture = RES.getRes(resName);
		result.texture = texture;
		return result;
	}


	/**
	 * 从父级移除child
	 * @param child
	 */
	public static removeFromParent(child: egret.DisplayObject) {
		if (!child || child.parent == null)
			return;

		child.parent.removeChild(child);
	}

	private static shakingList = {};

	/**滚动条滚动至底部 垂直*/
	public static scrollerToBottom(scroller: eui.Scroller): void {
		scroller.viewport.validateNow();
		if (scroller.viewport.contentHeight > scroller.height) {
			scroller.viewport.scrollV = scroller.viewport.contentHeight - scroller.height;
		}
	}

	public static scrollVTo(scroller: eui.Scroller, v: number, maxv: number): void {
		scroller.viewport.validateNow();
		// TimerManager.ins().doFrame(2, 1, () => {
		// if (scroller.viewport.contentHeight > scroller.height) {
		// let v = scroller.viewport.contentHeight - (item.y + item.height)
		// let maxv = scroller.viewport.contentHeight - scroller.height
		// console.log('scrollerToItem:', v)
		scroller.viewport.scrollV = v > maxv ? maxv : v
		// }
		// }, null)
	}

	public static alphaTween(target: egret.DisplayObject, time: number, start: number = 0, end: number = 1) {
		target.alpha = start;
		egret.Tween.get(target).to({ alpha: end }, time);
	}
}

window["DisplayUtils"] = DisplayUtils
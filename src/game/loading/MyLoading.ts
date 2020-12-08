/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-09 12:38:35 
 * @Last Modified by:   zhoulanglang 
 * @Last Modified time: 2020-04-09 12:38:35 
 */

class MyLoading implements RES.PromiseTaskReporter {

    private loadingUI: LoadingUI;
    public isLast: boolean;

    public constructor(loadingUI: LoadingUI, isLast?: boolean) {
        this.loadingUI = loadingUI;
        this.isLast = isLast;
    }

    /**
     * 进度
     */
    public onProgress(current: number, total: number) {
        this.loadingUI.onProgress(current, total, this.isLast)
    }

    // public loadingFinish() {
    //     this.loadingUI.loadingFinish();
    // }

}

window["MyLoading"] = MyLoading;
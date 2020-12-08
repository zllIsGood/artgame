/* 用户协议
 * @Author: zhoualnglang 
 * @Date: 2020-04-29 11:04:00 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-06 20:01:50
 */
class UserProtoWin extends BaseEuiView {

    public lab: eui.Label;
    public grp0: eui.Group;
    public grp1: eui.Group;


    public constructor() {
        super();
        this.skinName = "UserProtoSkin";
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.grp0, this.agree)
        this.addTouchEvent(this.grp1, this.reject)
        this.addTouchEvent(this.lab, this.onLab)
        this.upView()
    }

    onLab(e: egret.TouchEvent) {
        // let xy = this.getxy()
        console.log(e)
        let curX = e.localX + Math.floor((e.localY) / (24 + 12)) * 395
        if (curX >= this.xy0.x && curX < this.xy0.x2) { //服务协议
            console.log('服务协议')
            ViewManager.ins().open(UserProtoDetialWin, UserProtoDetialWinOpen.user)
        }
        else if (curX >= this.xy1.x && curX < this.xy1.x2) { //隐私政策
            console.log('隐私政策')
            ViewManager.ins().open(UserProtoDetialWin, UserProtoDetialWinOpen.private)
        }
    }

    xy0: { x, x2 } = { x: 2010, x2: 2134, }//null
    xy1: { x, x2 } = { x: 2180, x2: 2304, } //null
    /*getxy() {
        if (this.xy0 == null) {

            let lab1 = new eui.Label()
            lab1.size = 24
            lab1.text = '请务必仔细阅读、礼节“服务协议”和“隐私政策”各项条款。包括但不限于IP地址、读取个人通讯录等个人信息您可以在“设置”中查看、变更、删除个人信息并管理您的授权信息。您可阅读'
            let w = lab1.width
            lab1.text = '《服务协议》'
            let w0 = lab1.width

            let x = w
            this.xy0 = { x: x, w: w0, h: 24 }

            lab1.text = '请务必仔细阅读、礼节“服务协议”和“隐私政策”各项条款。包括但不限于IP地址、读取个人通讯录等个人信息您可以在“设置”中查看、变更、删除个人信息并管理您的授权信息。您可阅读《服务协议》和'
            w = lab1.width
            lab1.text = '《隐私政策》'
            w0 = lab1.width

            x = w
            this.xy1 = { x: x, w: w0, h: 24 }
        }
        return { xy0: this.xy0, xy1: this.xy1 }
    }*/

    agree() {
        App.ins().setShowUserProto(true)
        ViewManager.ins().close(this)
    }

    reject() {
        ViewManager.ins().close(this)
    }

    upView() {
        let str = `请务必仔细阅读、礼节“服务协议”和“隐私政策”各项条款。包括但不限于IP地址、读取个人通讯录等个人信息您可以在“设置”中查看、变更、删除个人信息并管理您的授权信息。您可阅读<font color = '#25D1E0'>《服务协议》</font>和<font color = '#25D1E0'>《隐私政策》</font>了解详细信息。若您同意，请点击“同意”开始接受我们的服务。`
        this.lab.textFlow = new egret.HtmlTextParser().parser(str)
    }

    public close(...param: any[]): void {
        // UserModel.ins().postUserProto()
    }

}
ViewManager.ins().reg(UserProtoWin, LayerManager.UI_LOADING);
window["UserProtoWin"] = UserProtoWin;
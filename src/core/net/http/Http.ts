/**
 * Created by luoy on 2016/12/20.
 * Http请求处理
 */
class Http extends BaseClass {


	/**
	 * 构造函数
	 */
	public constructor() {
		super();
	}

	public static ins(): Http {
		return super.ins() as Http;
	}

	/**
	 * 请求数据
	 * @param	paramUrl								请求地址
	 * @param	resType									返回的数据格式	true文本数据	false二进制数据
	 * @param	method									数据请求类型	true：GET	false：POST
	 * @param	onComplete(event: egret.Event)			请求完成
	 * @param	onError(event: egret.IOErrorEvent)		请求错误
	 * @param	onProgress(event: egret.ProgressEvent)	请求进度
	 */
	public send(paramUrl: string, resType: boolean, method: boolean, onComplete: Function, onError?: Function, onProgress?: Function): void {
		let request: egret.HttpRequest = new egret.HttpRequest();
		request.responseType = resType ? egret.HttpResponseType.TEXT : egret.HttpResponseType.ARRAY_BUFFER;
		request.open(paramUrl, method ? egret.HttpMethod.GET : egret.HttpMethod.POST);
		request.once(egret.Event.COMPLETE, onComplete, this);
		request.once(egret.IOErrorEvent.IO_ERROR, onError ? onError : () => { }, this);
		request.once(egret.ProgressEvent.PROGRESS, onProgress ? onProgress : () => { }, this);
		request.send();
	}

	public post(content) {
		//拼接参数
		let params = JSON.stringify(content.data);

		let request = new egret.HttpRequest();
		request.responseType = egret.HttpResponseType.TEXT;
		request.open(content.url, egret.HttpMethod.POST);
		//设置响应头
		for (let i in content.header) {
			request.setRequestHeader(i, content.header[i])
		}
		request.setRequestHeader("content-Type", "application/json");
		// request.setRequestHeader("Access-Control-Allow-Origin", "*");
		//发送参数
		request.send(params);
		// console.log('http:', JSON.stringify(content))
		request.addEventListener(egret.Event.COMPLETE, (res) => {
			let obj = { data: JSON.parse(res.target.response), statusCode: 200 }
			// console.log('http:', JSON.stringify(obj))
			content.success(obj)
		}, this);
		request.addEventListener(egret.IOErrorEvent.IO_ERROR, (res) => {
			// console.log('http:res', JSON.stringify(res))
		} /*content.fail*/, this);
	}

	public get(content) {
		//拼接参数 
		let params = ''
		if (content.data) {
			let data = content.data
			params += "?"
			let c = 0
			for (let i in data) {
				if (c != 0) {
					params += '&'
				}
				params += i + '=' + data[i]
				c++
			}
		}
		let request = new egret.HttpRequest();
		request.responseType = egret.HttpResponseType.TEXT;
		//将参数拼接到url
		request.open(content.url + params, egret.HttpMethod.GET);
		for (let i in content.header) {
			request.setRequestHeader(i, content.header[i])
		}
		// request.setRequestHeader("Content-Type", "application/json");
		// console.log('http:4', JSON.stringify(content), params)
		request.send();
		request.addEventListener(egret.Event.COMPLETE, (res) => {
			let obj = { data: JSON.parse(res.target.response), statusCode: 200 }
			// console.log('http:', JSON.stringify(obj))
			content.success(obj)
		}, this);
		request.addEventListener(egret.IOErrorEvent.IO_ERROR, content.fail, this);
	}

}


window["Http"] = Http
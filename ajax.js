/* options:
 * url 		请求地址
 * type 	请求方式:get/post,默认get
 * data 	请求的参数
 * dataType 请求的数据格式
 * success	请求成功的回调函数
 * error 	请求失败的回调函数
 */

function ajax (options) {
	options = options || {};
	
	options.type = options.type || 'get';
	options.data = options.data || {};
	options.dataType = options.dataType || 'text';
	
	let xhr = new XMLHttpRequest();

	// 数据组装
	let arr = [];
	for(let name in options.data){
		// 利用encodeURIComponent()来解决参数名/值是汉字时的异常情况
		arr.push(`${encodeURIComponent(name)}=${encodeURIComponent(options.data[name])}`);
	};
	let strData = arr.join('&');

	if(options.type.toUpperCase()=='POST'){
		xhr.open('POST', options.url, true);
		xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
		xhr.send(strData);
	} else {
		xhr.open('GET', `${options.url}?${strData}`, true);
		xhr.send();
	}


	xhr.onreadystatechange = function(){
		if(xhr.readyState==4){
			if(xhr.status>=200&&xhr.status<300 || xhr.status==304){
				// 默认dataType为text时：
				let data = xhr.responseText;

				// 判断dataType
				switch (options.dataType) {
					case 'json':
						data = JSON.parse(data);
						break;
					case 'xml':
						data = xhr.responseXML;
						break;
				}

				options.success && options.success(data)

			} else {
				options.error && options.error()
			}
		}
	}
}

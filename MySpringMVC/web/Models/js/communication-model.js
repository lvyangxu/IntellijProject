/**
 * description 通信处理模型
 * author lvyangxu
 * 2015-08-21
 */

//使用jquery执行ajax请求,参数依次为url网址（不能跨域）,http请求类型get或post,超时时间（秒）,请求的js对象,成功获取返回后的回调(参数为一个string),请求失败后的回调(参数为一个string)
function doAjaxInJquery(url, httpRequestType, requestTimeOutSecond, requestParaData, successCallback, failureCallback) {
    var request = $.ajax({
        type: httpRequestType,
        url: url,
        cache: false,
        timeout: requestTimeOutSecond * 1000,//超时时间
        data: requestParaData,
        contentType:"application/x-www-form-urlencoded;charset=utf-8",
        dataType: "text"
    }).done(function (data) {
        successCallback(data);
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        failureCallback(textStatus);
    });
    return request;
};

function doHttp(url,requestParaData){
	var promise = new Promise(function(resolve,reject){
		doAjaxInJquery(url,"post",30,requestParaData, function(result){
			try{
				result = result.toJson();
			}catch(e){
				reject("Server Internal Error");
			}		
			if(result.success!=undefined&&result.success=="true"){
				resolve(result.message);
			}else{
				var errorMessage = "Invalid Data";
				if(result.message!=undefined){
					errorMessage = result.message;
				}
				reject(errorMessage);
			}
		}, function(result){
			reject("Client Error,Please Check Your Network");
		});		
	});
    return promise;
}

function doHttpOnly(url,requestParaData){
	var promise = new Promise(function(resolve,reject){
		doAjaxInJquery(url,"post",30,requestParaData, function(result){
			try{
				result = result.toJson();
			}catch(e){
				reject("Server Internal Error");
			}	
			resolve(result.message);
		}, function(result){
			reject("Client Error,Please Check Your Network");
		});		
	});
    return promise;
}

/*
 * websocket对象封装，参数分别为服务器地址、用户名、密码、打开websocket后的回调、接收消息后的回调
 */
function MyWebsocket(url,username,password,openCallback,receiveMessageCallback){
    if(!window.WebSocket){
        alert("你的浏览器不支持websocket");
        return;
    }
    
    //拼接websocket的访问地址
    var baseUrl = window.location.href;
    baseUrl = baseUrl.replace(/http:/g, "ws:");
    var arr = baseUrl.split('/');
    arr[arr.length - 1] = "";
    arr[arr.length - 2] = "";
    var websocketUrl = "";
    for (var i = 0; i < arr.length - 2; i++) {
        websocketUrl = websocketUrl + arr[i] + "/";
    }
    websocketUrl = websocketUrl + url;      
    this.url = websocketUrl;
             
    //初始化websocket连接
    var webSocket = new WebSocket(this.url);
    this.receiveMessageCallback = receiveMessageCallback;
    this.websocketEventHandler(webSocket,openCallback);    
    this.webSocket = webSocket;
    this.username = username;
    this.password = password;
    
    
}

//websocket事件处理handler
MyWebsocket.prototype.websocketEventHandler = function(webSocket,openCallback){
    var myWebsocket = this;
    webSocket.onerror = function (event) {
        console.log("websocket发生异常:"+event);
    };
    webSocket.onopen = function (event) {
        console.log("websocket已连接");
        openCallback(myWebsocket);
    };
      
    webSocket.onmessage = function (event) {
        myWebsocket.receiveMessageCallback(event.data);
    };
    
     webSocket.onclose= function (event) {
        console.log("websocket已关闭:"+event.code);
    };    
}

//断线重连
MyWebsocket.prototype.reconnect = function(openCallback,receiveMessageCallback){
    var webSocket = new WebSocket(this.url);
    this.websocketEventHandler(webSocket,openCallback,receiveMessageCallback);
    this.webSocket = webSocket;  
}


///发送消息,参数分别为接收消息后的回调（超过128*64=8192个字符会抛出1009）
MyWebsocket.prototype.sendMessage =function(message) {
    if (this.webSocket.readyState != 1) {
        console.log("websocket失效,尝试重连");
        var webSocket = this.webSocket;
        //确保在新的websocket重连上再发送消息
        this.reconnect(function(myWebsocket){
            var result = myMessageEncode(myWebsocket.username, myWebsocket.password, "content", message);
            if (result.length <= 8192) {
                myWebsocket.webSocket.send(result);
            } else {
                for (var i = 0; i < result.length / 8192; i++) {
                    if (result.substring(i * 8192).length > 8192) {
                        myWebsocket.webSocket.send(result.substring(i * 8192, (i + 1) * 8192 - 1));
                    } else {
                        myWebsocket.webSocket.send(result.substring(i * 8192));
                    }
                }
            }
        }, this.receiveMessageCallback);
    } else {
        var result = myMessageEncode(this.username, this.password, "content", message);
        if (result.length <= 8192) {
            this.webSocket.send(result);
        } else {
            for (var i = 0; i < result.length / 8192; i++) {
                if (result.substring(i * 8192).length > 8192) {
                    this.webSocket.send(result.substring(i * 8192, (i + 1) * 8192 - 1));
                } else {
                    this.webSocket.send(result.substring(i * 8192));
                }
            }
        }


    }
}     


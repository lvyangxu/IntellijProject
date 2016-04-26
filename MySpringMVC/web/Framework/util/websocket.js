/**
 * Created by karl on 2016/4/22.
 */
class websocket{

    constructor(url,username,password,openCallback,receiveMessageCallback){
        if(!window.WebSocket){
            throw("your browser do not support websocket");
            return;
        }

        //get websocket url
        let baseUrl = window.location.href;
        baseUrl = baseUrl.replace(/http:/g, "ws:");
        let arr = baseUrl.split('/');
        arr[arr.length - 1] = ""; 
        arr[arr.length - 2] = "";
        let websocketUrl = "";
        for (var i = 0; i < arr.length - 2; i++) {
            websocketUrl += arr[i] + "/";
        }
        websocketUrl += url;
        this.url = websocketUrl;

        //init websocket
        let webSocket = new WebSocket(this.url);
        this.receiveMessageCallback = receiveMessageCallback;
        this.websocketEventHandler(webSocket,openCallback);
        this.webSocket = webSocket;
        this.username = username;
        this.password = password;
    }

    websocketEventHandler(webSocket,openCallback){
        let myWebsocket = this;
        webSocket.onerror = function (event) {
            console.log("websocket occur an error:"+event);
        };
        webSocket.onopen = function (event) {
            console.log("websocket connected");
            openCallback(myWebsocket);
        };

        webSocket.onmessage = function (event) {
            this.receiveMessageCallback(event.data);
        };

        webSocket.onclose= function (event) {
            console.log("websocket closed:"+event.code);
        };
    }

    reconnect(openCallback,receiveMessageCallback){
        let webSocket = new WebSocket(this.url);
        this.websocketEventHandler(webSocket,openCallback,receiveMessageCallback);
        this.webSocket = webSocket;
    }

    sendMessage(message) {
        if (this.webSocket.readyState != 1) {
            console.log("websocket reconnect");
            let webSocket = this.webSocket;
            //确保在新的websocket重连上再发送消息
            this.reconnect(function (myWebsocket) {
                let result = myMessageEncode(message);
                if (result.length <= 8192) {
                    myWebsocket.webSocket.send(result);
                } else {
                    for (let i = 0; i < result.length / 8192; i++) {
                        if (result.substring(i * 8192).length > 8192) {
                            myWebsocket.webSocket.send(result.substring(i * 8192, (i + 1) * 8192 - 1));
                        } else {
                            myWebsocket.webSocket.send(result.substring(i * 8192));
                        }
                    }
                }
            }, this.receiveMessageCallback);
        } else {
            let result = myMessageEncode(message);
            if (result.length <= 8192) {
                this.webSocket.send(result);
            } else {
                for (let i = 0; i < result.length / 8192; i++) {
                    if (result.substring(i * 8192).length > 8192) {
                        this.webSocket.send(result.substring(i * 8192, (i + 1) * 8192 - 1));
                    } else {
                        this.webSocket.send(result.substring(i * 8192));
                    }
                }
            }
        }
    }

    myMessageEncode(message) {
        let [u,p,t,m] = [this.username,this.password,"content",message];
        Array.from([u,p,t,m],d=>{
            d = new myString(d);
            d = d.base64Encode();
            return d.value;
        });
        let result = "{\"username\":\"${u}\",\"password\":\"${p}\",\"type\":\"${t}\",\"message\":\"${m}\"}";
        return result;
    }
}
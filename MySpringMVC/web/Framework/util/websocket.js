"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by karl on 2016/4/22.
 */

var websocket = function () {
    function websocket(url, username, password, openCallback, receiveMessageCallback) {
        _classCallCheck(this, websocket);

        if (!window.WebSocket) {
            throw "your browser do not support websocket";
            return;
        }

        //get websocket url
        var baseUrl = window.location.href;
        baseUrl = baseUrl.replace(/http:/g, "ws:");
        var arr = baseUrl.split('/');
        arr[arr.length - 1] = "";
        arr[arr.length - 2] = "";
        var websocketUrl = "";
        for (var i = 0; i < arr.length - 2; i++) {
            websocketUrl += arr[i] + "/";
        }
        websocketUrl += url;
        this.url = websocketUrl;

        //init websocket
        var webSocket = new WebSocket(this.url);
        this.receiveMessageCallback = receiveMessageCallback;
        this.websocketEventHandler(webSocket, openCallback);
        this.webSocket = webSocket;
        this.username = username;
        this.password = password;
    }

    _createClass(websocket, [{
        key: "websocketEventHandler",
        value: function websocketEventHandler(webSocket, openCallback) {
            var myWebsocket = this;
            webSocket.onerror = function (event) {
                console.log("websocket occur an error:" + event);
            };
            webSocket.onopen = function (event) {
                console.log("websocket connected");
                openCallback(myWebsocket);
            };

            webSocket.onmessage = function (event) {
                this.receiveMessageCallback(event.data);
            };

            webSocket.onclose = function (event) {
                console.log("websocket closed:" + event.code);
            };
        }
    }, {
        key: "reconnect",
        value: function reconnect(openCallback, receiveMessageCallback) {
            var webSocket = new WebSocket(this.url);
            this.websocketEventHandler(webSocket, openCallback, receiveMessageCallback);
            this.webSocket = webSocket;
        }
    }, {
        key: "sendMessage",
        value: function sendMessage(message) {
            if (this.webSocket.readyState != 1) {
                console.log("websocket reconnect");
                var webSocket = this.webSocket;
                //确保在新的websocket重连上再发送消息
                this.reconnect(function (myWebsocket) {
                    var result = myMessageEncode(message);
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
                var result = myMessageEncode(message);
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
    }, {
        key: "myMessageEncode",
        value: function myMessageEncode(message) {
            var u = this.username;
            var p = this.password;
            var t = "content";
            var m = message;

            Array.from([u, p, t, m], function (d) {
                d = new myString(d);
                d = d.base64Encode();
                return d.value;
            });
            var result = "{\"username\":\"${u}\",\"password\":\"${p}\",\"type\":\"${t}\",\"message\":\"${m}\"}";
            return result;
        }
    }]);

    return websocket;
}();

//# sourceMappingURL=websocket.js.map
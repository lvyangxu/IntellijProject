"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by karl on 2016/4/22.
 */

var http = function () {
    function http() {
        _classCallCheck(this, http);
    }

    _createClass(http, null, [{
        key: "doAjaxInJquery",


        /**
         * do ajax with jquery
         * @param url
         * @param httpRequestType
         * @param requestTimeOutSecond
         * @param requestParaData
         * @param successCallback
         * @param failureCallback
         * @returns {*}
         */
        value: function doAjaxInJquery(url, httpRequestType, requestTimeOutSecond, requestParaData, successCallback, failureCallback) {
            var request = $.ajax({
                type: httpRequestType,
                url: url,
                cache: false,
                timeout: requestTimeOutSecond * 1000,
                data: requestParaData,
                contentType: "application/x-www-form-urlencoded;charset=utf-8",
                dataType: "text"
            }).done(function (data) {
                successCallback(data);
            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                failureCallback(textStatus);
            });
            return request;
        }
    }, {
        key: "request",


        /**
         * do http with self defined result,only 'success = true' will resolve
         * @param url
         * @param requestParaData
         * @returns {Promise}
         */
        value: function request(url, requestParaData) {
            var promise = new Promise(function (resolve, reject) {
                requestParaData = requestParaData == undefined ? "" : requestParaData;
                http.doAjaxInJquery(url, "post", 30, requestParaData, function (result) {
                    try {
                        result = new myString(result).toJson();
                    } catch (e) {
                        reject("Invalid json format");
                    }
                    if (result.success != undefined && result.success == "true") {
                        resolve(result.message);
                    } else {
                        var errorMessage = "Invalid Data";
                        if (result.message != undefined) {
                            errorMessage = result.message;
                        }
                        reject(errorMessage);
                    }
                }, function (result) {
                    reject("Client Error,Please Check Your Network");
                });
            });
            return promise;
        }
    }]);

    return http;
}();

//# sourceMappingURL=http.js.map
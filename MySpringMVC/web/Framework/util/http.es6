/**
 * Created by karl on 2016/4/22.
 */

class http {

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
    static doAjaxInJquery(url, httpRequestType, requestTimeOutSecond, requestParaData, successCallback, failureCallback) {
        let request = $.ajax({
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
    };
 
    /**
     * do http with self defined result,only 'success = true' will resolve
     * @param url
     * @param requestParaData
     * @returns {Promise}
     */
    static request(url,requestParaData){ 
        var promise = new Promise(function(resolve,reject){
            requestParaData = (requestParaData==undefined)?"":requestParaData;
            http.doAjaxInJquery(url,"post",30,requestParaData, function(result){
                try{
                    result = new myString(result).toJson();
                }catch(e){ 
                    reject("Invalid json format");
                }
                if(result.success!=undefined&&result.success=="true"){
                    resolve(result.message);
                }else{
                    let errorMessage = "Invalid Data";
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

}
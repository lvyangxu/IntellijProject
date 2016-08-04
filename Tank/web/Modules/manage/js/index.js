"use strict";

{
    $(".table").table();

    $(".upload").delegate("", "click", function () {
        upload.do("../Code/Import", $(".import").children("input"), function () {}).then(function (d) {
            alert("import success");
        }).catch(function (d) {
            alert("import failed:" + d);
        });
    });

    $(".reserve").children("button").delegate("", "click", function () {
        var requestData = "";
        if (!$(this).hasClass("all")) {
            var v = $(".reserve").children("input").val();
            if (v == "") {
                alert("lack of email");
                return;
            }

            requestData = "email=" + v.split(",").map(function (d) {
                d = new myString(d).base64UrlEncode().value;
                return d;
            }).join(",");
        }
        http.request("../Broadcast/SendMail", requestData).then(function (result) {
            var message = "all:" + result.all + ",success:" + result.success;
            alert(message);
        }).catch(function (result) {
            alert(result);
        });
    });
}

//# sourceMappingURL=index.js.map
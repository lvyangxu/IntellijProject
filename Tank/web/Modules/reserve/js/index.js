"use strict";

/**
 * Created by karl on 2016/7/22.
 */
{
    $(".input input").delegate("", "input", function () {
        var email = $(".input input").val();
        var regex = /[^@]+@.+\..+/;
        if (email.match(regex) == null) {
            $(".input input").css({
                "border": "1px solid red"
            });
        } else {
            $(".input input").css({
                "border": "1px solid transparent"
            });
        }
    });

    $(".button button").delegate("", "click", function () {
        var email = $(".input input").val();
        var regex = /[^@]+@.+\..+/;

        if (email.match(regex) == null) {
            alert("your email format is not correct");
            return;
        }
        email = new myString(email).base64UrlEncode().value;
        var requestData = "email=" + email;
        http.doAjaxInJquery("../Reserve/Check", "post", 30, requestData, function (result) {
            var json = new myString(result).toJson();
            if (json.success == "true") {
                $(".result").html("您已经成功预约，asfasfajsfjaksfjasfajsf");
            } else {
                if (json.message == "reserved") {
                    $(".result").html("您已经预约过了");
                } else {
                    alert("预约失败:" + json.message);
                }
            }
        }, function (result) {
            alert("network error");
        });
    });
}

//# sourceMappingURL=index.js.map
"use strict";

{
    (function () {
        var usernameCookieName = void 0,
            passwordCookieName = void 0;

        //auto set input with cookie
        http.request("../Account/GetCookieName").then(function (result) {
            usernameCookieName = result.username;
            var username = cookie.get(usernameCookieName);
            $(".username").children("input").val(username);
            passwordCookieName = result.password;
            var password = cookie.get(passwordCookieName);
            $(".password").children("input").val(password);
        }).catch(function (result) {
            console.log("get cookie name failed:" + result);
        });

        //responsive
        $(".frame").fit(function () {
            var w = $(window).width();
            var h = $(window).height();
            var w1 = $(".frame").outerWidth();
            var h1 = $(".frame").outerHeight();
            $(".frame").css({
                "left": (w - w1) / 2 + "px",
                "top": (h - h1) / 2 + "px"
            });
        });

        //do login
        $(".frame").children(".login").children("button").delegate("", "click", function () {
            var username = $(".username").children("input").val();
            var usernameEncode = new myString(username).base64Encode().urlEncode().value;
            var password = $(".password").children("input").val();
            var passwordEncode = new myString(password).base64Encode().urlEncode().value;
            var requestData = "username=" + usernameEncode + "&password=" + passwordEncode;
            http.request("../Account/DoLogin", requestData).then(function (result) {
                //set cookie
                cookie.set(usernameCookieName, username, 30);
                cookie.set(passwordCookieName, password, 30);

                //redirect to another page
                window.location.href = result;
            }).catch(function (result) {
                alert("login failed:" + result);
            });
        });
    })();
}

//# sourceMappingURL=index.js.map
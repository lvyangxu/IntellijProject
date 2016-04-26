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

$(".frame").children(".login").children("button").delegate("", "click", function () {
    var username = $(".username").children("input").val();
    username = username.encode("base64").encode("url");
    var password = $(".password").children("input").val();
    password = password.encode("base64").encode("url");
    var requestData = "username=" + username + "&password=" + password;
    doHttp("../Account/DoLogin", requestData).then(function (result) {
        //set cookie
        setCookie("username", username, 30);
        setCookie("password", password, 30);

        //redirect to another page
        window.location.href = result;
        
    }).catch(function (result) {
        alert("login failed:" + result);
    });
});
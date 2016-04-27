{
    let usernameCookieName,passwordCookieName;

    //auto set input with cookie
    http.request("../Account/GetCookieName").then(result=>{
        usernameCookieName = result.username;
        let username = cookie.get(usernameCookieName);
        $(".username").children("input").val(username);
        passwordCookieName = result.password;
        let password = cookie.get(passwordCookieName);
        $(".password").children("input").val(password);
    }).catch(result=>{
        console.log("get cookie name failed:"+result);
    });

    //responsive
    $(".frame").fit(()=> {
        let w = $(window).width();
        let h = $(window).height();
        let w1 = $(".frame").outerWidth();
        let h1 = $(".frame").outerHeight();
        $(".frame").css({
            "left": (w - w1) / 2 + "px",
            "top": (h - h1) / 2 + "px"
        });
    });

    //do login
    $(".frame").children(".login").children("button").delegate("", "click", function () {
        let username = $(".username").children("input").val();
        let usernameEncode = new myString(username).base64Encode().urlEncode().value;
        let password = $(".password").children("input").val();
        let passwordEncode = new myString(password).base64Encode().urlEncode().value;
        let requestData = "username=" + usernameEncode + "&password=" + passwordEncode;
        http.request("../Account/DoLogin", requestData).then((result)=> {
            //set cookie
            cookie.set(usernameCookieName, username, 30);
            cookie.set(passwordCookieName, password, 30);

            //redirect to another page
            window.location.href = result;

        }).catch((result)=> {
            alert("login failed:" + result);
        });
    });
}
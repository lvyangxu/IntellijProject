/**
 * Created by karl on 2016/7/22.
 */
let recaptchaStr = "";
let setRecaptcha = (d)=>{
    recaptchaStr = d;
}

{
    
    $(".input input").delegate("","input",function () {
        let email = $(".input input").val();
        let regex = /[^@]+@.+\..+/;
        if(email.match(regex) == null) {
            $(".input input").css({
                "border": "1px solid red"
            });
        }else{
            $(".input input").css({
                "border": "1px solid transparent"
            });
        }
    });

    $(".button button").delegate("","click",function () {
        let email = $(".input input").val();
        let regex = /[^@]+@.+\..+/;

        if(email.match(regex) == null){
            alert("your email format is not correct");
            return;
        }
        if(recaptchaStr==""){
            alert("please complete the recaptcha first");
            return;
        }

        email = new myString(email).base64UrlEncode().value;
        recaptchaStr = new myString(recaptchaStr).base64UrlEncode().value;

        let requestData = "email=" + email+"&recaptcha="+recaptchaStr;
        http.doAjaxInJquery("../Reserve/Check", "post", 30, requestData, result=> {
            let json = new myString(result).toJson();
            if (json.success == "true") {
                $(".result").html("您已经成功预约，asfasfajsfjaksfjasfajsf");
            }else{
                if(json.message == "reserved"){
                    $(".result").html("您已经预约过了");
                }else{
                    alert("预约失败:"+json.message);
                }

            }
        }, result=> {
            alert("network error");
        });
    });
}


/**
 * Created by karl on 2016/7/22.
 */
let recaptchaStr = "";
let setRecaptcha = (d)=> {
    recaptchaStr = d;
}

{


    $(".slick").slick();

    $(document).ready(()=> {
        let bannerH = $(window).width()*0.54;
        $(".banner").children(".container").css({
            "margin-top":-bannerH * 0.55+40+"px"
        });
        
        if($(window).width()>768){
            $(".order").css({
                "height":$("video").height()
            });
        }else{
            $(".order").css({
                "height":"auto"
            });
        }
    });

    $(window).resize(function () {
        let bannerH = $(window).width()*0.54;
        $(".banner").children(".container").css({
            "margin-top":-bannerH * 0.55+"px"
        });
        if($(window).width()>768){
            $(".order").css({
                "height":$("video").height()
            });
        }else{
            $(".order").css({
                "height":"auto"
            });
        }

    });

    let channel = "";
    let param = window.location.search.substr(1);
    let channelStr = param.split("&").find(d=> {
        return (d.split("=")[0] == "utm_source");
    });
    if (channelStr != undefined) {
        channel = channelStr.split("=")[1];
    }

    $("video").delegate("", "click", function () {
        $(this)[0].play();
    });

    $(".email input").delegate("", "input", function () {
        let email = $(".email input").val();
        let regex = /[^@]+@.+\..+/;
        if (email.match(regex) == null) {
            $(".email input").css({
                "border-color": "red"
            });
        } else {
            $(".email input").css({
                "border-color": "rgba(250,237,220,1)"
            });
        }
    });

    $(".submit img").delegate("", "click", function () {
        let email = $(".email input").val();
        let regex = /[^@]+@.+\..+/;

        if (email.match(regex) == null) {
            alert("your email format is not correct");
            return;
        }
        if (recaptchaStr == "") {
            alert("please complete the recaptcha first");
            return;
        }

        email = new myString(email).base64UrlEncode().value;
        recaptchaStr = new myString(recaptchaStr).base64UrlEncode().value;


        let requestData = "email=" + email + "&recaptcha=" + recaptchaStr + "&channel=" + channel;
        http.doAjaxInJquery("../Reserve/Check", "post", 30, requestData, result=> {
            let json = new myString(result).toJson();
            if (json.success == "true") {
                ga('send', {
                    hitType: 'event',
                    eventCategory: 'Order',
                    eventAction: 'Order Success',
                    eventLabel: 'Email Order'
                });
                $(".order").children(".content").children(".before").hide();
                $(".order").children(".content").children(".after").html("<div class='orderText'>Заказ прошел успешно! Код подар" +
                    "ка будет отправлен вам на почту. Его можно будет использовать в и" +
                    "гре, чтобы получить специальную награду.</div>");
                $(".orderText").css({
                    "margin-bottom":($(".order").height()-$(".orderText").height())/2+"px"
                });
            } else {
                if (json.message == "reserved") {
                    $(".order").children(".content").children(".before").hide();
                    $(".order").children(".content").children(".after").html("<div class='orderText'>Вы уже заказали.</div>");
                } else {
                    alert("Заказ прошел неуспешно! Пожалуйста закажите еще раз.");
                    console.log("reserve failed:" + json.message);
                }
            }
        }, result=> {
            alert("network error");
        });
    });
}


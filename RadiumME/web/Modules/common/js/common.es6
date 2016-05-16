{
    //top img auto fit full sreen
    $(".top_img").fullFit(70, function () {
        $(".top").css({"overflow": "hidden"});
        $(".top").height($(window).height() - 70);
    });

    //top img overlay auto fit full screen
    $(".overlay").fit(()=> {
        $(document).ready(function () {
            $(".overlay").css({
                "width": $(window).width(),
                "height": $(window).height() - 70
            });
            let oh = $(".overlay").height();
            let th = $(".overlay").children(".text").height();
            let bh = $(".overlay").children(".text").children(".big").height();
            let sh = $(".overlay").children(".text").children(".small").height();
            let buttonH = $(".overlay").children(".text").children("button").height();
            let space = oh - bh - sh - buttonH;
            $(".overlay").children(".text").css({"margin-top": space * 0.5 + "px"});
            $(".overlay").children(".text").children(".small").css({"margin-top": space * 0.05 + "px"});
            $(".overlay").children(".text").children("button").css({"margin-top": space * 0.25 + "px"});
        });
    });

    //top button scroll
    $(".top").children(".overlay").children(".text").children("button").delegate("", "click", function () {
        var marginT = parseInt($(".body").children(".content").children("div").css("margin-top"));
        $("body").animate({scrollTop: $(".body").children(".content").offset().top - marginT - 70}, 1000);
    });

    //footer
    $(".footer").children(".content").children(".left").children("input").focus(function () {
        $(this).attr("placeholder", "");
    });
    $(".footer").children(".content").children(".left").children("input").blur(function () {
        $(this).attr("placeholder", "Subscribe email to our newsletter...");
    });

    //back to top button
    $(".back-to-top").children("i").delegate("", "click", function () {
        $("html,body").animate({"scrollTop": 0}, 1000);
    });
    if ($(window).scrollTop() == 0) {
        $(".back-to-top").fadeOut();
    } else {
        $(".back-to-top").fadeIn();
    }
    $(window).scroll(function () {
        if ($(window).scrollTop() == 0) {
            $(".back-to-top").fadeOut();
        } else {
            $(".back-to-top").fadeIn();
        }
    })

    //touch event
    let touchStartX, touchEndX, historyX = 0, currentX = 0, minX, maxX,leftX;
    $(".navbar .menu")[0].addEventListener("touchstart", function (e) {

        if ($(window).width() <= 1100) {
            let left = $(".navbar .menu").css("margin-left");
            left = Number.parseInt(left);
            minX = 0 - left;
            maxX =-$(window).width() * 0.4 - left;
            leftX = left;
            touchStartX = e.changedTouches[0].pageX;
            console.log(minX+","+maxX);
        }

    }, false);
    $(".navbar .menu")[0].addEventListener("touchmove", function (e) {
        e.preventDefault();
        if ($(window).width() <= 1100) {
            let thisTouchEndX = e.changedTouches[0].pageX;
            let touchMoveX = thisTouchEndX - touchStartX;
            currentX = currentX + touchMoveX;
            historyX += touchMoveX;
            // console.log(historyX);
            if (touchMoveX > minX) {
                return;
            }
            if (touchMoveX < maxX) {
                return;
            }
            setTimeout(()=> {
                $(".navbar .menu").css({"margin-left": touchMoveX+leftX});
            }, 1);
        }
    }, false);

}

//switch language
let currentLang = "en";
let switchLanguage = (callback)=> {
    $(".language").children(".lang").delegate("", "click", function () {
        if ($(this).hasClass("en")) {
            currentLang = "en";
        } else {
            currentLang = "ch";
        }
        callback();
    });
};

//load text
let loadText = (page, selectorArr, nameArr)=> {
    http.request("../Table/text/Read", "").then(result=> {
        for (let i = 0; i < selectorArr.length; i++) {
            let selector = selectorArr[i];
            let element;
            if (selector.includes(">")) {
                let arr = selector.split(">");
                selector = arr[0];
                let xPath = arr.slice(1).collect("join", ">");
                element = $(selector).xPath(xPath);
            } else {
                element = $(selector);
            }

            element.html(()=> {
                let text = result.filter(d=> {
                    return d.page == page;
                }).filter(d=> {
                    return d.name == nameArr[i];
                }).map(d=> {
                    return d[currentLang];
                }).collect("join", "");
                text = (text == undefined) ? "" : text;
                return text;
            });
        }
    }).catch(result=> {
        alert("loading data error,please refresh this page");
    });
}
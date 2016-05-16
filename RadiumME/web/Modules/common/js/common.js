"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

{
    (function () {
        //top img auto fit full sreen
        $(".top_img").fullFit(70, function () {
            $(".top").css({ "overflow": "hidden" });
            $(".top").height($(window).height() - 70);
        });

        //top img overlay auto fit full screen
        $(".overlay").fit(function () {
            $(document).ready(function () {
                $(".overlay").css({
                    "width": $(window).width(),
                    "height": $(window).height() - 70
                });
                var oh = $(".overlay").height();
                var th = $(".overlay").children(".text").height();
                var bh = $(".overlay").children(".text").children(".big").height();
                var sh = $(".overlay").children(".text").children(".small").height();
                var buttonH = $(".overlay").children(".text").children("button").height();
                var space = oh - bh - sh - buttonH;
                $(".overlay").children(".text").css({ "margin-top": space * 0.5 + "px" });
                $(".overlay").children(".text").children(".small").css({ "margin-top": space * 0.05 + "px" });
                $(".overlay").children(".text").children("button").css({ "margin-top": space * 0.25 + "px" });
            });
        });

        //top button scroll
        $(".top").children(".overlay").children(".text").children("button").delegate("", "click", function () {
            var marginT = parseInt($(".body").children(".content").children("div").css("margin-top"));
            $("body").animate({ scrollTop: $(".body").children(".content").offset().top - marginT - 70 }, 1000);
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
            $("html,body").animate({ "scrollTop": 0 }, 1000);
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
        });

        //touch event
        var touchStartX = void 0,
            touchEndX = void 0,
            historyX = 0,
            currentX = 0,
            minX = void 0,
            maxX = void 0,
            leftX = void 0;
        $(".navbar .menu")[0].addEventListener("touchstart", function (e) {

            if ($(window).width() <= 1100) {
                var left = $(".navbar .menu").css("margin-left");
                left = Number.parseInt(left);
                minX = 0 - left;
                maxX = -$(window).width() * 0.4 - left;
                leftX = left;
                touchStartX = e.changedTouches[0].pageX;
                console.log(minX + "," + maxX);
            }
        }, false);
        $(".navbar .menu")[0].addEventListener("touchmove", function (e) {
            e.preventDefault();
            if ($(window).width() <= 1100) {
                var _ret2 = function () {
                    var thisTouchEndX = e.changedTouches[0].pageX;
                    var touchMoveX = thisTouchEndX - touchStartX;
                    currentX = currentX + touchMoveX;
                    historyX += touchMoveX;
                    // console.log(historyX);
                    if (touchMoveX > minX) {
                        return {
                            v: void 0
                        };
                    }
                    if (touchMoveX < maxX) {
                        return {
                            v: void 0
                        };
                    }
                    setTimeout(function () {
                        $(".navbar .menu").css({ "margin-left": touchMoveX + leftX });
                    }, 1);
                }();

                if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
            }
        }, false);
    })();
}

//switch language
var currentLang = "en";
var switchLanguage = function switchLanguage(callback) {
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
var loadText = function loadText(page, selectorArr, nameArr) {
    http.request("../Table/text/Read", "").then(function (result) {
        var _loop = function _loop(i) {
            var selector = selectorArr[i];
            var element = void 0;
            if (selector.includes(">")) {
                var arr = selector.split(">");
                selector = arr[0];
                var xPath = arr.slice(1).collect("join", ">");
                element = $(selector).xPath(xPath);
            } else {
                element = $(selector);
            }

            element.html(function () {
                var text = result.filter(function (d) {
                    return d.page == page;
                }).filter(function (d) {
                    return d.name == nameArr[i];
                }).map(function (d) {
                    return d[currentLang];
                }).collect("join", "");
                text = text == undefined ? "" : text;
                return text;
            });
        };

        for (var i = 0; i < selectorArr.length; i++) {
            _loop(i);
        }
    }).catch(function (result) {
        alert("loading data error,please refresh this page");
    });
};

//# sourceMappingURL=common.js.map
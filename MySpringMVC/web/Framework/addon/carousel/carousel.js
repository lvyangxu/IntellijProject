'use strict';

/**
 * carousel js
 */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
})(function ($) {
    "use strict";

    $.fn.carousel = function (options) {
        return this.each(function () {
            carousel($(this), options);
        });
    };

    var carousel = function carousel(element, options) {

        var settings = element.addonSettingExtend(options, {
            "dots": true,
            "arrow": false,
            "fit": false,
            "scale": 1,
            "outerDots": false,
            "dotsActiveColor": "rgba(255,255,255,1)",
            "dotsHoverColor": "rgba(255,255,255,0.6)",
            "dotsColor": "rgba(255,255,255,0.28)"
        });

        element.addonInit("carousel", function () {

            var html = element.prop("innerHTML");
            element.html("<div>" + html + "</div>");

            // build pagination html
            if (settings.dots) {
                element.append(function () {
                    var innerHtml = "<span class='pagination'>";
                    var i = 0;
                    element.children("div").children("div").each(function (index) {
                        if (i == 0) {
                            innerHtml += "<div index='" + i + "' style='background-color: " + settings.dotsActiveColor + "' class='active'></div>";
                        } else {
                            innerHtml += "<div index='" + i + "' style='background-color: " + settings.dotsColor + "'></div>";
                        }

                        i++;
                    });
                    innerHtml += "</span>";
                    return innerHtml;
                });
            }

            element.css({ "overflow": "hidden" });
            var n = element.children("div").children("div").length;

            //build arrow html
            if (settings.arrow) {
                element.append(function () {
                    var innerHtml = "<span class='arrow'>";
                    innerHtml += "<div class='left'></div>";
                    innerHtml += "<div class='right'></div>";
                    innerHtml += "</span>";
                    return innerHtml;
                });
                var ph = element.children("div").children("div").height();
                element.children(".arrow").css({
                    "margin-top": ph * 0.4
                });
            }

            //resize with window
            element.fit(function () {
                $(document).ready(function () {
                    element.children("div").css({
                        "width": n * 100 + "%"
                    });
                    element.children("div").children("div").css({
                        "width": 100 / n + "%"
                    });
                    var ph = element.children("div").children("div").height();
                    element.children(".arrow").children("div").css({
                        "height": ph * 0.1,
                        "width": ph * 0.1 * 425 / 925
                    });
                });
            });

            //switch to another div
            element.data("currentIndex", 0);
            element.children(".pagination").children("div").delegate("", "click", function (event) {
                var currentIndex = $(this).attr("index");
                var lastIndex = element.data("currentIndex");
                if (currentIndex == lastIndex) {
                    return;
                }
                element.children("div").animate({
                    "left": -100 * currentIndex + "%"
                }, 1000);

                var lastDots = element.children(".pagination").children("div[index=" + lastIndex + "]");
                var currentDots = element.children(".pagination").children("div[index=" + currentIndex + "]");
                lastDots.css({
                    "background-color": settings.dotsColor
                });
                lastDots.removeClass("active");
                currentDots.css({
                    "background-color": settings.dotsActiveColor
                });
                currentDots.addClass("active");
                element.data("currentIndex", currentIndex);
            });

            //arrow opacity
            element.children(".arrow").children("div").hover(function () {
                $(this).css({ "opacity": "1" });
            }, function () {
                $(this).css({ "opacity": "0.5" });
            });

            //swipe
            var swipe = function swipe(moveX) {
                var lastIndex = element.data("currentIndex");
                var currentIndex = void 0;
                if (moveX > 30) {
                    if (lastIndex != 0) {
                        currentIndex = lastIndex - 1;
                        element.children("div").animate({
                            "left": -100 * currentIndex + "%"
                        }, 1000, function () {
                            if (currentIndex == 0) {
                                element.children(".arrow").children(".left").hide();
                            } else {
                                element.children(".arrow").children(".left").show();
                            }
                            if (currentIndex == n - 1) {
                                element.children(".arrow").children(".right").hide();
                            } else {
                                element.children(".arrow").children(".right").show();
                            }
                        });
                        element.data("currentIndex", currentIndex);
                        element.children(".pagination").children("div[index=" + lastIndex + "]").removeClass("active");
                        element.children(".pagination").children("div[index=" + lastIndex + "]").css({
                            "background-color": settings.dotsColor
                        });
                        element.children(".pagination").children("div[index=" + currentIndex + "]").addClass("active");
                        element.children(".pagination").children("div[index=" + currentIndex + "]").css({
                            "background-color": settings.dotsActiveColor
                        });
                    }
                }
                if (moveX < -30) {
                    if (lastIndex != n - 1) {
                        currentIndex = lastIndex + 1;
                        element.children("div").animate({
                            "left": -100 * currentIndex + "%"
                        }, 1000, function () {
                            if (currentIndex == 0) {
                                element.children(".arrow").children(".left").hide();
                            } else {
                                element.children(".arrow").children(".left").show();
                            }
                            if (currentIndex == n - 1) {
                                element.children(".arrow").children(".right").hide();
                            } else {
                                element.children(".arrow").children(".right").show();
                            }
                        });
                        element.data("currentIndex", currentIndex);
                        element.children(".pagination").children("div[index=" + lastIndex + "]").removeClass("active");
                        element.children(".pagination").children("div[index=" + lastIndex + "]").css({
                            "background-color": settings.dotsColor
                        });
                        element.children(".pagination").children("div[index=" + currentIndex + "]").addClass("active");
                        element.children(".pagination").children("div[index=" + currentIndex + "]").css({
                            "background-color": settings.dotsActiveColor
                        });
                    }
                }
            };

            element.children(".arrow").children("div").delegate("", "click", function () {
                var lastIndex = element.data("currentIndex");
                var currentIndex;
                if ($(this).hasClass("left")) {
                    if (lastIndex == 0) {
                        return;
                    } else {
                        currentIndex = lastIndex - 1;
                    }
                } else {
                    if (lastIndex == n - 1) {
                        return;
                    } else {
                        currentIndex = lastIndex + 1;
                    }
                }
                element.children("div").animate({
                    "left": -100 * currentIndex + "%"
                }, 1000, function () {
                    if (currentIndex == 0) {
                        element.children(".arrow").children(".left").hide();
                    } else {
                        element.children(".arrow").children(".left").show();
                    }
                    if (currentIndex == n - 1) {
                        element.children(".arrow").children(".right").hide();
                    } else {
                        element.children(".arrow").children(".right").show();
                    }
                });
                element.children(".pagination").children("div[index=" + lastIndex + "]").removeClass("active");
                element.children(".pagination").children("div[index=" + lastIndex + "]").css({
                    "background-color": settings.dotsColor
                });
                element.children(".pagination").children("div[index=" + currentIndex + "]").addClass("active");
                element.children(".pagination").children("div[index=" + currentIndex + "]").css({
                    "background-color": settings.dotsActiveColor
                });
                element.data("currentIndex", currentIndex);
            });

            //mouse event
            element.delegate("", "dragstart", function (e) {
                e.preventDefault();
            });
            var isDragging = false;
            var mouseStartX = void 0;
            element.delegate("", "mousedown", function (e) {
                isDragging = true;
                mouseStartX = e.pageX;
            });
            element.delegate("", "click", function (e) {
                e.preventDefault();
            });
            $(window).delegate("", "mouseup", function (e) {
                if (isDragging) {
                    var endX = e.pageX;
                    var mouseMoveX = endX - mouseStartX;
                    swipe(mouseMoveX);
                }
                isDragging = false;
            });

            //touch event
            var touchStartX = void 0,
                touchEndX = void 0;
            element[0].addEventListener("touchstart", function (e) {
                e.preventDefault();
                touchStartX = e.changedTouches[0].pageX;
            }, false);
            element[0].addEventListener("touchend", function (e) {
                e.preventDefault();
                var lastIndex = element.data("currentIndex");
                var currentIndex = void 0;
                touchEndX = e.changedTouches[0].pageX;
                var touchMoveX = touchEndX - touchStartX;
                swipe(touchMoveX);
            }, false);
        });

        element.children(".arrow").fit(function () {
            var ph = element.children("div").children("div").height();
            var ah = element.children(".arrow").children(".left").height();
            element.children(".arrow").css({
                "margin-top": (ph - ah) * 0.5
            });
        });

        if (settings.outerDots) {
            var m = (element.width() - 76) / 2;
            element.children(".pagination").css({
                "position": "inherit",
                "margin-left": m + "px",
                "line-height": "80px"
            });
            element.children(".pagination").children("div").addClass("outer");
            element.children(".pagination").children("div").css({
                "background-color": settings.outerDotsColor
            });
            element.children(".pagination").children("div").hover(function () {
                $(this).css({
                    "background-color": settings.dotsHoverColor
                });
            }, function () {
                $(this).css({
                    "background-color": $(this).hasClass("active") ? settings.dotsActiveColor : settings.dotsColor
                });
            });
        }

        if (settings.callback) {
            settings.callback();
        }

        return element;
    };
});

//# sourceMappingURL=carousel.js.map
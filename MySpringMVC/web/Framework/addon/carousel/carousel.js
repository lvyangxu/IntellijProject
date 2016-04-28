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

        var settings = element.addonSettingExtend(options);

        element.addonInit("carousel", function () {

            var html = element.prop("innerHTML");
            element.html("<div>" + html + "</div>");

            //init setting
            var defaultSetting = {
                "dots": true,
                "arrow": false
            };
            settings = $.extend(defaultSetting, settings);

            // build pagination html
            if (settings.dots) {
                element.append(function () {
                    var innerHtml = "<span class='pagination'>";
                    var i = 0;
                    element.children("div").children("div").each(function (index) {
                        var active = index == 0 ? "class='active'" : "";
                        innerHtml += "<div index='" + i + "' " + active + "></div>";
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
                var _ph = element.children("div").children("div").height();
                element.children(".arrow").css({
                    "margin-top": _ph * 0.4
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
                element.children(".pagination").children("div[index=" + lastIndex + "]").removeClass("active");
                element.children(".pagination").children("div[index=" + currentIndex + "]").addClass("active");
                element.data("currentIndex", currentIndex);
            });

            //arrow opacity
            element.children(".arrow").children("div").hover(function () {
                $(this).css({ "opacity": "1" });
            }, function () {
                $(this).css({ "opacity": "0.5" });
            });

            element.children(".arrow").children("div").delegate("", "click", function () {
                var lastIndex = element.data("currentIndex");
                var currentIndex;
                if ($(this).hasClass("left")) {
                    if (lastIndex == 0) {
                        currentIndex = n - 1;
                    } else {
                        currentIndex = lastIndex - 1;
                    }
                } else {
                    if (lastIndex == n - 1) {
                        currentIndex = 0;
                    } else {
                        currentIndex = lastIndex + 1;
                    }
                }
                element.children("div").animate({
                    "left": -100 * currentIndex + "%"
                }, 1000);
                element.children(".pagination").children("div[index=" + lastIndex + "]").removeClass("active");
                element.children(".pagination").children("div[index=" + currentIndex + "]").addClass("active");
                element.data("currentIndex", currentIndex);
            });

            element.delegate("", "dragstart", function (e) {
                e.preventDefault();
            });

            var isDragging = false;
            var x = void 0;
            element.delegate("", "mousedown", function (e) {
                isDragging = true;
                x = e.pageX;
                console.log("down");
            });
            element.delegate("", "mouseup", function (e) {
                isDragging = false;
                console.log("up");
            });
            $(window).delegate("", "mouseup", function (e) {
                console.log(e.target);
                isDragging = false;
                console.log("up");
            });
        });

        //
        // //touch event
        // var touchElement = element[0];
        // if (options != undefined && options.overlay != undefined) {
        //     touchElement = options.overlay[0];
        // }
        // var startX, endX, x;
        // touchElement.addEventListener("touchstart", function (evt) {
        //     evt.preventDefault();
        //     startX = evt.changedTouches[0].pageX;
        //     x = startX;
        // }, false);
        // touchElement.addEventListener("touchend", function (evt) {
        //     evt.preventDefault();
        //     x = evt.changedTouches[0].pageX;
        //     if (Math.abs(x - startX) > 30) {
        //         alert(1);
        //     }
        // }, false);

        if (options == undefined) {
            return;
        }

        if (options.fit != undefined) {
            var ph = element.children("div").children("div").height();
            element.children(".arrow").css({
                "margin-top": ph * 0.4
            });
        }

        return element;
    };
});

//# sourceMappingURL=carousel.js.map
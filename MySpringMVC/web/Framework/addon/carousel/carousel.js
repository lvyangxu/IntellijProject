/**
 * carousel js
 */
(function ($) {
    "use strict";
    $.fn.carousel = function (options) {
        return this.each(function () {
            doCarousel($(this), options);
        });
    };

    var doCarousel = function (element, options) {
        // init
        if (!element.data("init")) {
            (function () {
                if (!element.hasClass("addon-carousel")) {
                    element.addClass("addon-carousel");
                }

                var html = element.prop("innerHTML");
                element.html("<div>" + html + "</div>");

                // build pagination html
                element.append(function () {
                    var innerHtml = "<span class='pagination-div'>";
                    var i = 0;
                    element.children("div").children("div").each(function (index) {
                        var active = (index == 0) ? "class='active'" : "";
                        innerHtml += "<div index='" + i + "' " + active + "></div>";
                        i++;
                    });
                    innerHtml += "</span>";
                    return innerHtml;
                });

                element.css({"overflow": "hidden"});
                var n = element.children("div").children("div").length;

                //resize with window
                element.fit(function () {
                    $(document).ready(function () {


                    element.children("div").css({
                        "width": n * 100 + "%"
                    });
                    element.children("div").children("div").css({
                        "width": 100 / n + "%"
                    });

                    var w = element.parent().width();
                    var h = element.children("div").children("div").height();
                    //pagination location
                    element.children(".pagination-div").css({
                        // "left": element.offset().left + (w - 76) / 2 + "px",
                        // "margin-top": (h - 10) * 0.9 + "px"
                    });
                    // console.log(element.children("div").children("div").height());
                    });
                });


                //switch to another div
                element.data("currentIndex", 0);
                element.children(".pagination-div").children("div").delegate("", "click", function (event) {
                    var currentIndex = $(this).attr("index");
                    var lastIndex = element.data("currentIndex");
                    if (currentIndex == lastIndex) {
                        return;
                    }
                    var w = element.children("div").children("div").width();
                    var h = element.children("div").children("div").height();
                    element.children("div").animate({
                        "left": -100 * currentIndex + "%"
                    }, 1000);
                    element.children(".pagination-div").children("div[index=" + lastIndex + "]").removeClass("active");
                    element.children(".pagination-div").children("div[index=" + currentIndex + "]").addClass("active");

                    element.data("currentIndex", currentIndex);

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
            })();

            //add to element data
            element.data({"init": true});
        }
        ;

        return element;
    }

})(jQuery);

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
                    var innerHtml = "<span class='pagination'>";
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

                //build arrow html
                if(options!=undefined&&options.arrow==true){
                    element.append(function () {
                        var innerHtml = "<span class='arrow'>";
                        innerHtml += "<div class='left'></div>";
                        innerHtml += "<div class='right'></div>";
                        innerHtml += "</span>";
                        return innerHtml;
                    });
                    element.children(".arrow").css({
                        "margin-top":(element.children("div").children("div").height()-50)/2
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


                element.children(".arrow").children("div").hover(function () {
                    $(this).css({"opacity":"1"});
                },function () {
                    $(this).css({"opacity":"0.5"});
                });

                element.children(".arrow").children("div").delegate("","click",function () {
                    var lastIndex = element.data("currentIndex");
                    var currentIndex;
                    if($(this).hasClass("left")){
                        if(lastIndex==0){
                            currentIndex = n - 1;
                        }else{
                            currentIndex = lastIndex - 1;
                        }
                    }else{
                        if(lastIndex==n-1){
                            currentIndex = 0;
                        }else{
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

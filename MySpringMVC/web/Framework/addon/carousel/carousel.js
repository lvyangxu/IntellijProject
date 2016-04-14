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

                element.addClass("addon-carousel");

                // build pagination html
                element.append(function () {
                    var innerHtml = "<span class='pagination-div'>";
                    var i = 0;
                    element.children("div").each(function (index) {
                        var active = (index == 0) ? "class='active'" : "";
                        innerHtml += "<div index='" + i + "' " + active + "></div>";
                        i++;
                    });
                    innerHtml += "</span>";
                    return innerHtml;
                });
                //

                var n = element.children("div").length;
                var w = element.children("div").width();
                element.css({
                    "width":n*w
                });
                console.log(element.parent().width());

                element.parent().css({"overflow":"hidden"});

                element.children("pagination-div").children("div").delegate("","click",function(){
                    alert(2);
                    // $(this).parent().animate({"margin-left":-arrX[1]});
                });

                // //get all image property
                // var imageArr = [];
                // element.children("div").each(function (index) {
                //     //get current display x and y
                //     var arr = $(this).attr("size").split(",");
                //     var x = arr[0];
                //     var y = arr[1];
                //     var src = $(this).attr("src");
                //     imageArr.push({"x":x,"y":y,"src":src,"index":index});
                // });

                //build display html
                // element.append("<div class='display'></div>");
                // element.children(".display").append(function () {
                //     var displayHtml = imageArr.map(function (d) {
                //         var displayDivHtml = "<div index='"+d.index+"' style='url(" + d.src + ") no-repeat '></div>";
                //         return displayDivHtml;
                //     }).collect("join","");
                //     return displayHtml;
                // });

                //set default background
                // element.children(".display").css({"height":element.parent().height()+"px"});
                // element.data("currentIndex", 0);
                // element.children(".display").children("div").hide();
                // element.children(".display").children("div").first().show();

                //resize with window
                element.fit(function () {
                    //pagination location
                    element.children(".pagination-div").css({
                        "left": (element.parent().width() - 70) / 2 + "px"
                    });

                });

                //switch to another div
                element.children(".pagination-div").children("div").delegate("", "click", function (event) {
                    console.log(2);
                    var currentIndex = $(this).attr("index");
                    var lastIndex = element.data("currentIndex");
                    if (currentIndex == lastIndex) {
                        return;
                    }
                    var lastOffset = getCurrentOffset(imageArr[lastIndex]);
                    var currentOffset = getCurrentOffset(imageArr[currentIndex]);
                    var lastCssStr = "url('"+imageArr[lastIndex].src+"') "+lastOffset.x+"px "+lastOffset.y+"px / "+lastOffset.scale+" no-repeat ";
                    var currentCssStr = "url('"+imageArr[currentIndex].src+"') "+currentOffset.x+"px "+currentOffset.y+"px / "+currentOffset.scale+" no-repeat ";

                    element.children(".display").css({
                        "background":lastCssStr+","+currentCssStr
                    });
                    var w = element.parent().width();
                    element.children(".display").animate({"left": "-100%"},"slow", function () {
                        // $(this).hide();
                    });
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
        };

        return element;
    }

})(jQuery);

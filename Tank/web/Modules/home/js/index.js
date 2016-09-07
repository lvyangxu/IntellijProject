"use strict";

/**
 * Created by karl on 2016/7/18.
 */
{
    (function () {
        //tab
        $(".middle").children(".container").children(".left").children("div[tab]").first().show();
        $(".tab").children("div[name]").delegate("", "click", function () {
            var name = $(this).attr("name");
            $(".middle").children(".container").children(".left").children("div[tab]").hide();
            $(".tab").children("div[name]").removeClass("active");
            $(".middle").children(".container").children(".left").children("div[tab=" + name + "]").show();
            $(".tab").children("div[name=" + name + "]").addClass("active");
        });

        var articleText2 = [];
        $(".article").children(".right").children(".text2").each(function () {
            articleText2.push($(this).html());
        });

        var setFoot = function setFoot() {
            if ($(window).width() < 768 && $(window).width() >= 480) {
                $(".article").children(".right").children(".text2").each(function (index) {
                    var short = $(this).text().substr(0, 100) + "...";
                    $(this).text(short);
                });
            } else if ($(window).width() < 480) {
                $(".article").children(".right").children(".text2").each(function (index) {
                    var short = $(this).text().substr(0, 50) + "...";
                    $(this).text(short);
                });
            } else {
                $(".article").children(".right").children(".text2").each(function (index) {
                    $(this).html(articleText2[index]);
                });
            }

            $(".foot2").height();
        };

        $(document).ready(function () {
            setFoot();
        });

        $(window).resize(function () {
            setFoot();
        });
    })();
}

//# sourceMappingURL=index.js.map
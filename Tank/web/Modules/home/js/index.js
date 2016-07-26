"use strict";

/**
 * Created by karl on 2016/7/18.
 */
{
    //tab
    $(".middle").children(".container").children(".left").children("div[tab]").first().show();
    $(".tab").children(".container").children("div[name]").delegate("", "click", function () {
        var name = $(this).attr("name");
        $(".middle").children(".container").children(".left").children("div[tab]").hide();
        $(".tab").children(".container").children("div[name]").removeClass("active");
        $(".middle").children(".container").children(".left").children("div[tab=" + name + "]").show();
        $(".tab").children(".container").children("div[name=" + name + "]").addClass("active");
    });

    //game image view
    $(".gameImage").find("img").delegate("", "click", function () {
        if ($(this).hasClass("game")) {
            return;
        }
        var src = $(this).attr("src").replace(".png", "") + "-big.jpg";
        var h = $(window).height();
        $(".modal").css({
            "height": h + "px"
        });
        $(".modal").html(function () {
            var d = "<div class='imgFrame'><div class='close'><img class='closeImage' src='../Modules/home/image/close.png'></div>";
            d += "<div class='paddingFrame'><img class='bigImage' src='" + src + "'></div></div>";
            return d;
        });

        //modal close
        $(".modal").delegate("", "keydown", function (e) {
            if (e.keyCode == 27) {
                $(".modal").fadeOut(1000);
            }
        });
        $(".modal").children(".imgFrame").children(".close").children("img").delegate("", "click", function () {
            $(".modal").fadeOut(1000);
        });

        $(".modal").fadeIn(1000);
        $(".modal").focus();
    });
}

//# sourceMappingURL=index.js.map
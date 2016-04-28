"use strict";

{
    $("#top-carousel").carousel({
        "dots": false,
        "arrow": true
    });
    $("#our-games-carousel").carousel();

    $(".top_img").fullFit(70);

    $("#top-carousel").carousel({
        "fit": true
    });

    $(".overlay").fit(function () {
        $(document).ready(function () {
            $(".overlay").css({
                "width": $(window).width(),
                "height": $(window).height() - 70
            });
            var oh = $(".overlay").height();
            var ch = $(".overlay").children(".text").height();
            console.log(oh);
            $(".overlay").children(".text").css({ "margin-top": (oh - ch) * 0.45 + "px" });
        });
    });
}

//# sourceMappingURL=index.js.map
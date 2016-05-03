"use strict";

{
    $("#top-carousel").carousel({
        "dots": false,
        "arrow": true
    });
    $("#our-games-carousel").carousel();
    $(".top_img").fullFit(70, function () {
        $(".top").height($(window).height() - 70);
    });

    $("#top-carousel").carousel({
        "fit": true
    });
}

//# sourceMappingURL=index.js.map
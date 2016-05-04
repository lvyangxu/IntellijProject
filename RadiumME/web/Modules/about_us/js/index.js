"use strict";

{
    $(".carousel").carousel({
        "outerDots": true
    });

    $(".carousel").xPath("div>div").each(function () {
        var h = $(this).height();
        var ph = $(this).children(".small").children("p").outerHeight(true);
        $(this).children(".small").children("p").css({ "margin-top": h - ph + "px" });
    });

    $(".position").height($(".c").height());
}

//# sourceMappingURL=index.js.map
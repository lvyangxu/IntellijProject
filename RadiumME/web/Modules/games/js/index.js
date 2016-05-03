"use strict";

{
    var h = 0;
    $(".body").children(".content").children("div").each(function () {
        var left = $(this).children(".left").height();
        var right = $(this).children(".right").height();
        h += left > right ? left : right;
    });
    $(".body").children(".content").height(h);
}

//# sourceMappingURL=index.js.map
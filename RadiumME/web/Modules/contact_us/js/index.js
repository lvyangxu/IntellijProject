"use strict";

{
    (function () {
        //load text
        var selectors = [".top button", ".recruit-content1 .big", ".recruit-content1 .small", ".recruit-content2 .big", ".recruit-content2 .small", ".recruit-content3 .big", ".recruit-content3 .small"];
        var names = ["top-button", "big1", "small1", "big2", "small2", "big3", "small3"];
        var page = "contact-us";
        loadText(page, selectors, names);
        switchLanguage(function () {
            loadText(page, selectors, names);
        });

        $(".recruit").fit(function () {
            var w = $(window).width();
            if (w < 1330) {
                var sectionW = (w - 4) / 3;
                $(".recruit").children("div").css({
                    width: sectionW,
                    height: sectionW
                });
                var bigH = $(".recruit").children("div").children(".big").height();
                var smallH = $(".recruit").children("div").children(".small").height();
                $(".recruit").children("div").children(".big").css({
                    "padding-top": (sectionW - 15 - bigH - smallH) / 2
                });
                $(".recruit").children("div").children(".circle").css({
                    "top": (sectionW - 15 - bigH - smallH) / 2 + 10
                });
            }
        });
    })();
}

//# sourceMappingURL=index.js.map
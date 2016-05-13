"use strict";

{
    (function () {
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

        //load text
        var selectors = [".top .big1", ".top .big2", ".top .big3", ".top .small1", ".top .small2", ".top .small3", ".about-us p", ".our-games p", ".developers p"];
        var names = ["top-big-1", "top-big-2", "top-big-3", "top-small-1", "top-small-2", "top-small-3", "about-us-paragraph", "our-games-paragraph", "developers-paragraph"];
        var page = "home";
        loadText(page, selectors, names);
        switchLanguage(function () {
            loadText(page, selectors, names);
        });
    })();
}

//# sourceMappingURL=index.js.map
"use strict";

{
    (function () {
        $("#top-carousel").carousel({
            "dots": false,
            "arrow": true
        });
        $("#our-games-carousel").carousel({
            "outerDots": true
        });

        $("#top-carousel").carousel({
            "fit": true
        });

        //load text
        var selectors = [".top .big1", ".top .big2", ".top .big3", ".top .small1", ".top .small2", ".top .small3", ".about-us p", ".our-games p", ".developers p", ".about-us .title", ".about-us button a", ".our-games .title", ".our-games button a", ".developers .title", ".developers .text1", ".developers .text2", ".developers .text3", ".developers .text4", ".developers .text5"];
        var names = ["top-big-1", "top-big-2", "top-big-3", "top-small-1", "top-small-2", "top-small-3", "about-us-paragraph", "our-games-paragraph", "developers-paragraph", "about-us-title", "about-us-button", "our-games-title", "our-games-button", "developers-title", "developers-text1", "developers-text2", "developers-text3", "developers-text4", "developers-text5"];
        var page = "home";
        loadText(page, selectors, names);
        switchLanguage(function () {
            loadText(page, selectors, names);
        });

        $(".about-us button").delegate("", "click", function () {
            window.location.href = "../about_us/#" + currentLang;
        });

        $(".our-games button").delegate("", "click", function () {
            window.location.href = "../games/#" + currentLang;
        });
    })();
}

//# sourceMappingURL=index.js.map
"use strict";

{
    (function () {
        //load text
        var selectors = [".top button", ".body>.content>.content-title", ".section1 .title", ".section2 .title", ".section3 .title", ".section4 .title", ".section5 .title", ".section1 .text", ".section2 .text", ".section3 .text", ".section4 .text", ".section5 .text"];
        var names = ["top-button", "body-title", "section1-title", "section2-title", "section3-title", "section4-title", "section5-title", "section1-paragraph", "section2-paragraph", "section3-paragraph", "section4-paragraph", "section5-paragraph"];
        var page = "developers";
        loadText(page, selectors, names);
        switchLanguage(function () {
            loadText(page, selectors, names);
            if (currentLang == "ch") {
                $(".body .content .section .title").addClass("font-weight-normal");
            } else {
                $(".body .content .section .title").removeClass("font-weight-normal");
            }
        });
    })();
}

//# sourceMappingURL=index.js.map
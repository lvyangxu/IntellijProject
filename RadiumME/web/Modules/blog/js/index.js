"use strict";

{
    (function () {
        //load text
        var selectors = [".top button", ".section1 .title", ".section2 .title", ".section3 .title", ".section1 .paragraph", ".section2 .paragraph", ".section3 .paragraph", ".section1 .bottom", ".section2 .bottom", ".section3 .bottom"];
        var names = ["top-button", "section1-title", "section2-title", "section3-title", "section1-paragraph", "section2-paragraph", "section3-paragraph", "section1-bottom", "section2-bottom", "section3-bottom"];
        var page = "blog";
        loadText(page, selectors, names);
        switchLanguage(function () {
            loadText(page, selectors, names);
        });
    })();
}

//# sourceMappingURL=index.js.map
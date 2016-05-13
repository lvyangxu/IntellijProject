"use strict";

{
    (function () {
        //load text
        var selectors = [".top button", ".section1 .title", ".section2 .title", ".section1 p", ".section2 p"];
        var names = ["top-button", "section1-title", "section2-title", "section1-paragraph", "section2-paragraph"];
        var page = "blog";
        loadText(page, selectors, names);
        switchLanguage(function () {
            loadText(page, selectors, names);
        });
    })();
}

//# sourceMappingURL=index.js.map
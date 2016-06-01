"use strict";

{
    (function () {
        //load text
        var selectors = [".top button", ".recruit-content .small"];
        var names = ["top-button", "contact-text"];
        var page = "contact-us";
        loadText(page, selectors, names);
        switchLanguage(function () {
            loadText(page, selectors, names);
        });
    })();
}

//# sourceMappingURL=index.js.map
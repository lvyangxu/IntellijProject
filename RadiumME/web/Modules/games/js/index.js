"use strict";

{
    (function () {
        //load text
        var selectors = [".top button", ".top .big", ".top .small", ".game1 .title", ".game1 p", ".game1 .button span", ".game2 .title", ".game2 p", ".game2 .button span"];
        var names = ["top-button", "top-big", "top-small", "game1-title", "game1-paragraph", "game1-button", "game2-title", "game2-paragraph", "game2-button"];
        var page = "games";
        loadText(page, selectors, names);
        switchLanguage(function () {
            loadText(page, selectors, names);
        });
    })();
}

//# sourceMappingURL=index.js.map
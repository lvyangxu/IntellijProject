"use strict";

{
    (function () {
        //load text
        var selectors = [".top button", ".top .big", ".top .small", ".game1 .title", ".game1 p", ".game2 .title", ".game2 p"];
        var names = ["top-button", "top-big", "top-small", "game1-title", "game1-paragraph", "game2-title", "game2-paragraph"];
        var page = "games";
        loadText(page, selectors, names);
        switchLanguage(function () {
            loadText(page, selectors, names);
        });
    })();
}

//# sourceMappingURL=index.js.map
"use strict";

{
    (function () {
        //load text
        var selectors = [".top button", "game-div>.title", "game1 .name", "game2 .name", "game3 .name", "game4 .name", ".address>.title", ".address>.left>.button", ".address>.left p", ".address>.right>.button", ".address>.right p"];
        var names = ["top-button", "games-title", "game1-title", "game2-title", "game3-title", "game4-title", "address-title", "left-title", "left-paragraph", "right-title", "right-paragraph"];
        var page = "contact-us";
        loadText(page, selectors, names);
        switchLanguage(function () {
            loadText(page, selectors, names);
        });
    })();
}

//# sourceMappingURL=index.js.map
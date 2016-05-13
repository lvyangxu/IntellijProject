{
    //load text
    let selectors = [".top button", "game-div>.title", "game1 .name", "game2 .name", "game3 .name", "game4 .name",
        ".address>.title",".address>.left>.button",".address>.left p",".address>.right>.button",".address>.right p"];
    let names = ["top-button", "games-title", "game1-title", "game2-title", "game3-title", "game4-title",
        "address-title", "left-title", "left-paragraph", "right-title", "right-paragraph"];
    let page = "contact-us";
    loadText(page, selectors, names);
    switchLanguage(()=> {
        loadText(page, selectors, names);
    });
}
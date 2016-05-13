{
    //load text
    let selectors = [".top button",".top .big",".top .small",".game1 .title",".game1 p",".game2 .title",".game2 p"];
    let names = ["top-button","top-big","top-small","game1-title","game1-paragraph","game2-title","game2-paragraph"];
    let page = "games";
    loadText(page, selectors, names);
    switchLanguage(()=>{
        loadText(page, selectors, names);
    });

}

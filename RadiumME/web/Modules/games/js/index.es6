{
    //load text
    let selectors = [".top button",".top .big",".top .small",".game1 .title",".game1 p",".game1 .button span",".game2 .title",".game2 p",".game2 .button span"];
    let names = ["top-button","top-big","top-small","game1-title","game1-paragraph","game1-button","game2-title","game2-paragraph","game2-button"];
    let page = "games";
    loadText(page, selectors, names);
    switchLanguage(()=>{
        loadText(page, selectors, names);
    }); 

}

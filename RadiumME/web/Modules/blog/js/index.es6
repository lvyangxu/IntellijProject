{
    //load text
    let selectors = [".top button",
        ".section1 .title",".section2 .title",".section3 .title",
        ".section1 .paragraph",".section2 .paragraph",".section3 .paragraph",
        ".section1 .bottom",".section2 .bottom",".section3 .bottom"];
    let names = ["top-button",
        "section1-title","section2-title","section3-title",
        "section1-paragraph","section2-paragraph","section3-paragraph",
        "section1-bottom","section2-bottom","section3-bottom"];
    let page = "blog";
    loadText(page, selectors, names);
    switchLanguage(()=> {
        loadText(page, selectors, names);
    });
}
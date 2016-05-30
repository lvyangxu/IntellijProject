{
    //load text
    let selectors = [".top button",".section1 .title",".section2 .title",".section1 .paragraph",".section2 .paragraph",".section1 .bottom",".section2 .bottom"];
    let names = ["top-button","section1-title","section2-title","section1-paragraph","section2-paragraph","section1-bottom","section2-bottom"];
    let page = "blog";
    loadText(page, selectors, names);
    switchLanguage(()=> {
        loadText(page, selectors, names);
    });
}
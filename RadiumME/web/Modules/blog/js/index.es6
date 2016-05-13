{
    //load text
    let selectors = [".top button",".section1 .title",".section2 .title",".section1 p",".section2 p"];
    let names = ["top-button","section1-title","section2-title","section1-paragraph","section2-paragraph"];
    let page = "blog";
    loadText(page, selectors, names);
    switchLanguage(()=> {
        loadText(page, selectors, names);
    });
}
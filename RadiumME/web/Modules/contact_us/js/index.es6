{
    //load text
    let selectors = [".top button", ".recruit-content .small"];
    let names = ["top-button", "contact-text"];
    let page = "contact-us";
    loadText(page, selectors, names);
    switchLanguage(()=> {
        loadText(page, selectors, names);
    });
}
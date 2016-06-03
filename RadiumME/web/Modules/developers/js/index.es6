{
    //load text
    let selectors = [".top button", ".body .content .content-title", ".section1 .title", ".section2 .title", ".section3 .title", ".section4 .title", ".section5 .title"
        , ".section1 .text", ".section2 .text", ".section3 .text", ".section4 .text", ".section5 .text"];
    let names = ["top-button", "body-title", "section1-title", "section2-title", "section3-title", "section4-title", "section5-title",
        "section1-paragraph", "section2-paragraph", "section3-paragraph", "section4-paragraph", "section5-paragraph"];
    let page = "developers";
    loadText(page, selectors, names);
    switchLanguage(()=> {
        loadText(page, selectors, names);
        if(currentLang=="ch"){
            $(".body .content .section .title").addClass("font-weight-normal");
        }else{
            $(".body .content .section .title").removeClass("font-weight-normal");
        }
    });
}

{
    //load text
    let selectors = [".top button", ".recruit-content1 .big", ".recruit-content1 .small",
        ".recruit-content2 .big", ".recruit-content2 .small",
        ".recruit-content3 .big", ".recruit-content3 .small"];
    let names = ["top-button", "big1", "small1", "big2", "small2", "big3", "small3"];
    let page = "contact-us";
    loadText(page, selectors, names);
    switchLanguage(()=> {
        loadText(page, selectors, names);
    });

    $(".recruit").fit(()=>{
        let w = $(window).width();
        if (w < 1330) {
            let sectionW = (w - 4) / 3;
            $(".recruit").children("div").css({
                width: sectionW,
                height: sectionW
            });
            let bigH = $(".recruit").children("div").children(".big").height();
            let smallH = $(".recruit").children("div").children(".small").height();
            $(".recruit").children("div").children(".big").css({
                "padding-top":(sectionW-15-bigH-smallH)/2
            });
            $(".recruit").children("div").children(".circle").css({
                "top":(sectionW-15-bigH-smallH)/2+10
            });
        }
    });


}
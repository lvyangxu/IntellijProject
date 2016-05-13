{
    $("#top-carousel").carousel({
        "dots": false,
        "arrow": true
    });
    $("#our-games-carousel").carousel();
    $(".top_img").fullFit(70, function () {
        $(".top").height($(window).height() - 70);
    });

    $("#top-carousel").carousel({
        "fit": true
    });

    //load text
    let selectors = [".top .big1", ".top .big2", ".top .big3", ".top .small1", ".top .small2", ".top .small3", ".about-us p", ".our-games p", ".developers p"];
    let names = ["top-big-1", "top-big-2", "top-big-3", "top-small-1", "top-small-2", "top-small-3", "about-us-paragraph", "our-games-paragraph", "developers-paragraph"];
    let page = "home";
    loadText(page, selectors, names);
    switchLanguage(()=>{
        loadText(page, selectors, names);
    });

}





{
    $(".carousel").carousel({
        "outerDots":true
    });

    $(".carousel").xPath("div>div").each(function () {
        let h = $(this).height();
        let ph = $(this).children(".small").children("p").outerHeight(true);
        $(this).children(".small").children("p").css({"margin-top":h-ph+"px"});
    });

    $(".position").height($(".c").height());
}
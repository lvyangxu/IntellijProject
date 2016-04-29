{
    $("#top-carousel").carousel({
        "dots": false,
        "arrow": true
    });
    $("#our-games-carousel").carousel();

    $(".top_img").fullFit(70);

    $("#top-carousel").carousel({
        "fit": true
    });

    $(".overlay").fit(()=> {
        $(document).ready(function () {
            $(".overlay").css({
                "width": $(window).width(),
                "height": $(window).height() - 70
            });
            var oh = $(".overlay").height();
            var ch = $(".overlay").children(".text").height();
            $(".overlay").children(".text").css({"margin-top": (oh - ch) * 0.45 + "px"});
        });
    });
}





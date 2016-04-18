// $(".top").children(".carousel").fullFit(70);
$("#top-carousel").carousel();
$("#our-games-carousel").carousel({"arrow":true});

$(".top_img").fullFit(70);



$(".overlay").fit(function () {
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






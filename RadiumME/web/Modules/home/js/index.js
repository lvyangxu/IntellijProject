$(".top_img").fullFit(70);

$(".carousel").carousel();

$(".overlay").fit(function () {
    $(document).ready(function () {
        $(".overlay").css({
            "width": $(window).width(),
            "height": $(window).height() - 70
        });
        console.log($(window).height());
        var oh = $(".overlay").height();
        var ch = $(".overlay").children(".text").height();

        $(".overlay").children(".text").css({"margin-top": (oh - ch) * 0.45 + "px"});
    });
});






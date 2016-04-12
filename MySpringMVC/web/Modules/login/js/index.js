
$(".frame").fit(function () {
    var w = $(window).width();
    var h = $(window).height();
    var w1 = $(".frame").outerWidth();
    var h1 = $(".frame").outerHeight();
    $(".frame").css({
        "margin-left":(w-w1)/2+"px",
        "margin-top":(h-h1)/2+"px"
    });
});

$(".frame").children(".login").children("button").delegate("","click",function () {

});
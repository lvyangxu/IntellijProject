// $(".owl-carousel").owlCarousel({
//     items: 1,
//     autoplay:true,
//     autoplayTimeout:5000,
//     autoplayHoverPause:true,
//     loop:true,
//     smartSpeed:1000,
//     dots:true
// });

$(".carousel").carousel();

$("#top_carousel").unslider({
    dots: true
});

$(".overlay").fit(function () {
    $(".overlay").css({
        "width": $(window).width(),
        "height": $(window).height()
    });
    var oh = $(".overlay").height();
    var ch = $(".overlay").children(".text").height();
    $(".overlay").children(".text").css({"margin-top": (oh - ch) / 2 + "px"});

});

// $(".games_pic").owlCarousel({
//     items: 1,
//     autoplay:true,
//     autoplayTimeout:5000,
//     autoplayHoverPause:true,
//     loop:true,
//     smartSpeed:1000
// });

$(".top_img").fullFit(0);





// $(".addon-carousel").carousel({"overlay":$(".overlay")});

$(".overlay").fit(function(){
    $(".overlay").css({"height":$(window).height()-70+"px"});
    var oh = $(".overlay").height();
    var ch = $(".overlay").children(".contain").height();
    $(".overlay").children(".contain").css({"margin-top":(oh-ch)/2+"px"});

});


$(".owl-carousel").owlCarousel({
    "items":1
});

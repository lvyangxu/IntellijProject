
 //vertical menu bar
 $(".navbar").children(".content").children(".list").children(".fa").delegate("", "click", function () {
     if($(this).hasClass("fa-list")){
         $(this).slideUp("fast", function () {
             $(this).parent().children(".fa-times").slideDown("fast");
             $(".head").children(".content").children(".menu").slideDown("fast");
         });
     }else{
         $(this).slideUp("fast", function () {
             $(this).parent().children(".fa-list").slideDown("fast");
             $(".head").children(".content").children(".menu").slideUp("fast");
         });
     }
 });

 // var mh = $(".navbar").children("div").children(".content").children(".menu").children("div").height();
 // $(".navbar").children("div").children(".content").children(".menu").children("div").css({"margin-top":(70-mh)/2});

 $(".top").height($(window).height()-70);

$(".top").children("img").fullFit(0);

// $(".top").children(".text").children("button").delegate("","click",function(){
//     var marginT = parseInt($(".body").children(".content").children("div").css("margin-top"));
//      $("body").animate({scrollTop:$(".body").children(".content").offset().top-marginT}, 1000);
// });

 $(".footer").children(".content").children(".left").children("input").focus(function () {
    $(this).attr("placeholder","");
 });

 $(".footer").children(".content").children(".left").children("input").blur(function () {
     $(this).attr("placeholder","Subscribe email to our newsletter...");
 });

 //back to top button
$(".back-to-top").children("i").delegate("","click",function(){
     $("html,body").animate({"scrollTop":0}, 1000);
});
if($(window).scrollTop()==0){
    $(".back-to-top").fadeOut();
}else{
    $(".back-to-top").fadeIn();
}
$(window).scroll(function(){
    if($(window).scrollTop()==0){
        $(".back-to-top").fadeOut();
    }else{
        $(".back-to-top").fadeIn();
    }
})

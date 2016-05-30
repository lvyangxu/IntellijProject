{
    $(".carousel").carousel({
        "outerDots": true,
        dotsActiveColor:"rgba(0,0,0,1)",
        dotsHoverColor:"rgba(0,0,0,0.6)",
        dotsColor:"rgba(0,0,0,0.28)"
    });

    //load text
    let selectors = [".top button",".body>.content>.title",".body>.content>p",".carousel-text1 .text-title",".carousel-text2 .text-title",".carousel-text3 .text-title",".carousel-text1 .text-content",".carousel-text2 .text-content",".carousel-text3 .text-content"];
    let names = ["top-button","body-title","body-paragraph","carousel-title-1","carousel-title-2","carousel-title-3","carousel-paragraph-1","carousel-paragraph-2","carousel-paragraph-3"];
    let page = "about-us";
    loadText(page, selectors, names); 
    switchLanguage(()=>{
        loadText(page, selectors, names);
    });

}

//google map api
function initMap() {
    $("#map").css({"height":$(".a").height()});
    // Create a map object and specify the DOM element for display.
    var addr = {lat: 30.574954, lng: 104.060799};
    var map = new google.maps.Map(document.getElementById('map'), {
        center: addr,
        scrollwheel: true,
        zoom: 16
    });
    var marker = new google.maps.Marker({
        position: addr,
        label: "A",
        map: map
    });
}
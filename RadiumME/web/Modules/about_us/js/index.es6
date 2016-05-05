{
    $(".carousel").carousel({
        "outerDots":true,
        "callback":function () {
            $(".carousel").xPath("div>div").each(function () {
                let h = $(this).height();
                let ph = $(this).children(".small").children("p").outerHeight(true);
                $(this).children(".small").children("p").css({"margin-top":h-ph+"px"});
            });
        }
    });
    
    $(document).ready(function () {
        $(".position").height($(".c").height());
    });



    function initMap() {
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
}
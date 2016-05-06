{
    $(".carousel").carousel({
        "outerDots":true
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
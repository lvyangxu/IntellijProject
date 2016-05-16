"use strict";

{
    (function () {
        $(".carousel").carousel({
            "outerDots": true
        });

        //load text
        var selectors = [".top button", ".body>.content>.title", ".body>.content>.p", ".carousel-text1", ".carousel-text2", ".carousel-text3"];
        var names = ["top-button", "body-title", "body-paragraph", "carousel-paragraph-1", "carousel-paragraph-2", "carousel-paragraph-3"];
        var page = "about-us";
        loadText(page, selectors, names);
        switchLanguage(function () {
            loadText(page, selectors, names);
        });
    })();
}

//google map api
function initMap() {
    $("#map").css({ "height": $(".a").height() });
    // Create a map object and specify the DOM element for display.
    var addr = { lat: 30.574954, lng: 104.060799 };
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

//# sourceMappingURL=index.js.map
/**
 * demo like below
 */
$.fn.modal = function (option) {

    //default settings
    let settings = {
        width: 0.4,
        height: 0.4,
        marginTop: 0.3,
        html:""
    }
    let w = $(window).width();
    let h = $(window).height();
    option = (option == undefined) ? {} : option;
    settings = $.extend(settings, option);

    $("body").prepend(()=> {
        let html = "<div class='addon-modal' tabindex='1'>";
        html += "<div class='modal-panel'>";
        html += "<div class='close'><button class='button-info' title='click this or press ESC close modal'><i class='fa fa-times'></i></button></div>";
        html += settings.html;
        html += "</div>";
        html += "</div>";
        return html;
    });


    $("body").xPath(".addon-modal>.modal-panel").css({
        "width": settings.width * w,
        "height": settings.height * h,
        "margin-top": settings.marginTop * h
    })

    $("body").children(".addon-modal").fadeIn();
    $("body").children(".addon-modal").focus();

    $("body").xPath(".addon-modal>.modal-panel>.close>.button-info").delegate("","click",function (e) {
        $("body").children(".addon-modal").fadeOut(function () {
            $(this).remove();
        });
    });
    $("body").children(".addon-modal").delegate("","keydown",function (e) {
        if(e.keyCode == 27){
            $("body").children(".addon-modal").fadeOut(function () {
                $(this).remove();
            });
        }

    });

}
{
    $(".nav").nav();

    $("#home").section({"min-height": $(window).height - 70});
    $("#about_us").section({"min-height": $(window).height - 70});
    $("#games").section({"min-height": $(window).height - 70});
    $("#developers").section({"min-height": $(window).height - 70});
    $("#blog").section({"min-height": $(window).height - 70});
    $("#contact_us").section({"min-height": $(window).height - 70});

    $(".table").table();

    $("body").delegate("", "click", function(event) {
        $(".addon-datepicker").children(".contain").children(".panel").hide();
        $(".addon-wall").children(".contain").children(".panel").hide();
        $(".addon-select").children(".contain").children(".panel").hide();
        $(".addon-upload").children(".contain").children(".panel").hide();
    });
}
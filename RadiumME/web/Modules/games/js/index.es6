{
    let h = 0;
    $(".body").children(".content").children("div").each(function () {
        let left = $(this).children(".left").height();
        let right = $(this).children(".right").height();
        h += (left>right)?left:right;
    });
    $(".body").children(".content").height(h);
}

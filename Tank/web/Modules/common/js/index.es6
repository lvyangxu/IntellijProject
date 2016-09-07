{
//back to top button
    $(".back-to-top").delegate("", "click", function () {
        $("html,body").animate({"scrollTop": 0}, 1000);
    });
    if ($(window).scrollTop() == 0) {
        $(".back-to-top").fadeOut();
    } else {
        $(".back-to-top").fadeIn();
    }
    $(window).scroll(function () {
        if ($(window).scrollTop() == 0) {
            $(".back-to-top").fadeOut();
        } else {
            $(".back-to-top").fadeIn();
        }
    })

    let nav = ()=> {
        let allW = $(".head").children(".container").width();
        let navW = 0;
        $(".head").children(".container").children("div").each(function () {
            navW += $(this).width();
            navW += $(this).next(".line").width();
            if($(window).width()>640){
                navW += 10;
            }

        });
        let spaceW = allW - navW - 1;
        $(".head").children(".container").children(".page").each(function (index) {
            $(this).css({"margin-left": spaceW * 0.2});
            if (index == $(".head").children(".container").children(".page").length - 1) {
                $(this).next(".line").css({"margin-right": spaceW * 0.2});
            }
        });
    }
    $(document).ready(()=> {
        nav();
    });

    $(window).resize(()=> {
        nav();
    });
}
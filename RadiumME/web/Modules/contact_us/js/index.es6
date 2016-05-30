{
    //load text
    let selectors = [".top button", "game-div>.title", "game1 .name", "game2 .name", "game3 .name", "game4 .name",
        ".address>.title", ".address>.left>.button", ".address .left p", ".address>.right>.button", ".address .right p"];
    let names = ["top-button", "games-title", "game1-title", "game2-title", "game3-title", "game4-title",
        "address-title", "left-title", "left-paragraph", "right-title", "right-paragraph"];
    let page = "contact-us";
    loadText(page, selectors, names);
    switchLanguage(()=> {
        loadText(page, selectors, names);
    });

    //job detail
    $(".recruit-table").children("table").children("tbody").children("tr").children("td:not([colspan=4])").delegate("", "click", function () {
        $(this).parent().next().children("td[colspan=4]").toggle();
    });

    //open resume form
    $(".recruit-table .submit button").delegate("", "click", ()=> {
        $(".resume-div").css({
            "left":($(window).width()-300)/2,
            "top":($(window).height()-300)/2
        })
        $(".resume-div").show();
    });

    //select attachment
    $(".resume-div .attachment button").delegate("", "click", ()=> {
        $(".resume-div .attachment input").click();
    });

    //listen attachment change
    $(".resume-div .attachment input").delegate("", "change", function() {
        let file = this.files[0];
        if(file==undefined){
            $(".resume-div .attachment button").text("点此添加你的简历");
            return;
        }
        let displayName = (file.name.length>=15)?(file.name.substr(0,15)+"..."):file.name;
        $(".resume-div .attachment button").text(displayName);
    });

    $(".resume-div .name,.phone input").delegate("", "change", function() {
        if($(this).val()==""){
            $(this).css({
                "border":"1px solid red"
            });
        }else{
            $(this).css({
                "border":"1px solid rgba(165,199,254,1)"
            });
        }
    });
}
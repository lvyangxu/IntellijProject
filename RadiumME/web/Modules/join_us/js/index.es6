{
    //load text
    let selectors = [".top button", "game-div>.title", "game1 .name", "game2 .name", "game3 .name", "game4 .name",
        ".address>.title", ".address>.left>.button", ".address .left p", ".address>.right>.button", ".address .right p"];
    let names = ["top-button", "games-title", "game1-title", "game2-title", "game3-title", "game4-title",
        "address-title", "left-title", "left-paragraph", "right-title", "right-paragraph"];
    let page = "join-us";
    loadText(page, selectors, names);
    switchLanguage(()=> {
        loadText(page, selectors, names);
    });

    //job detail
    $(".recruit-table").children("table").children("tbody").children("tr").children("td:not([colspan=4])").delegate("", "click", function () {
        $(this).parent().next().children("td[colspan=4]").toggle();
    });

    //open resume form
    $(".recruit-table .submit button").delegate("", "click", function () {
        $(".resume-div").css({
            "left": ($(window).width() - 300) / 2,
            "top": ($(window).height() - 300) / 2
        })
        $(".resume-div").show();
        $(".resume-div .position .right").text($(this).parent().parent().parent().prev().children("td:first").text());
    });

    //select attachment
    $(".resume-div .attachment button").delegate("", "click", ()=> {
        $(".resume-div .attachment input").click();
    });

    //listen attachment change
    $(".resume-div .attachment input").delegate("", "change", function () {
        let file = this.files[0];
        if (file == undefined) {
            $(".resume-div .attachment button").text("点此添加你的简历");
            $(".resume-div .attachment button").css({
                "border": "1px solid red"
            });
            return;
        }
        let displayName = (file.name.length >= 15) ? (file.name.substr(0, 15) + "...") : file.name;
        $(".resume-div .attachment button").text(displayName);
        $(".resume-div .attachment button").css({
            "border": "1px solid rgba(165,199,254,1)"
        });
    });

    //listen input change
    $(".resume-div .name input,.resume-div .phone input").delegate("", "change", function () {
        if ($(this).val() == "") {
            $(this).css({
                "border": "1px solid red"
            });
        } else {
            $(this).css({
                "border": "1px solid rgba(165,199,254,1)"
            });
        }
    });

    $(".resume-div .close i").delegate("","click",function () {
        $(".resume-div").hide();
    });

    //send resume
    $(".resume-div .send button").delegate("", "click", function () {
        let positionText = $(".resume-div .position .right");
        let nameInput = $(".resume-div .name input");
        let phoneInput = $(".resume-div .phone input");
        let statusText = $(".resume-div .status .right");
        let attachmentInput = $(".resume-div .attachment input");

        //form check
        if (nameInput.val() == "") {
            nameInput.focus();
            return;
        }
        if (phoneInput.val() == "") {
            phoneInput.focus();
            return;
        }
        if(attachmentInput[0].files[0]==undefined){
            attachmentInput.focus();
            return;
        }
        if(nameInput.val().length>10){
            alert("名字太长了");
            return;
        }

        let phoneRegex = new RegExp(/^\d{11}$/g);
        if(!phoneRegex.test(phoneInput.val())){
            phoneInput.focus();
            alert("输入的手机号不正确");
            return;
        }

        let requestData = "position=" + new myString(positionText.text()).base64UrlEncode().value;
        requestData += "&name=" + new myString(nameInput.val()).base64UrlEncode().value;
        requestData += "&phone=" + new myString(phoneInput.val()).base64UrlEncode().value;
        let uploadFile = new FormData();
        uploadFile.append(0,attachmentInput[0].files[0]);
        let xhr = new XMLHttpRequest();

        statusText.html("<div class='progress'><div class='percent'></div></div>");
        xhr.upload.addEventListener("progress", function(evt){
            if (evt.lengthComputable) {
                let percentComplete = Math.round(evt.loaded * 100 / evt.total);
                statusText.css({"width":percentComplete*190/100+"px"});
                statusText.children(".progress").text(percentComplete+"%");
            }
        }, false);
        xhr.addEventListener("load", function(evt){
            let result = evt.target.responseText;
            let jsonObject;
            try{
                jsonObject = new myString(result).toJson();
            }catch(e){
                console.log(e.message);
                return;
            }
            if (jsonObject.success == "true") {
                alert("投递成功");
            } else {
                alert("投递失败:"+jsonObject.message);
            }
        }, false);
        xhr.addEventListener("error", function(){
            alert("投递失败,请检查本地网络是否正常");
        }, false);
        xhr.addEventListener("abort", function(){
            console.log("投递操作已被强行终止");
        }, false);
        xhr.open("POST", "../Resume/Send?"+requestData);
        xhr.send(uploadFile);
    });


}
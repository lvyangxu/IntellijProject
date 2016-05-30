{
    let noLeft = $(".top_img").hasClass("top_img1");
    //top img auto fit full sreen
    $(".top_img").fullFit(70, function () {
        $(".top").css({"overflow": "hidden"});
        $(".top").height($(window).height() - 70);
    }, noLeft);

    //top img overlay auto fit full screen
    $(".top .overlay").fit(()=> {
        $(document).ready(function () {
            $(".top .overlay").css({
                "width": $(window).width(),
                "height": $(window).height() - 70
            });
            let oh = $(".overlay").height();
            let th = $(".overlay").children(".text").height();
            let bh = $(".overlay").children(".text").children(".big").height();
            let sh = $(".overlay").children(".text").children(".small").height();
            let buttonH = $(".overlay").children(".text").children("button").height();
            let space = oh - bh - sh - buttonH;
            $(".top .overlay").children(".text").css({"margin-top": space * 0.5 + "px"});
            $(".top .overlay").children(".text").children(".small").css({"margin-top": space * 0.05 + "px"});
            $(".top .overlay").children(".text").children("button").css({"margin-top": space * 0.25 + "px"});
        });
    });

    //top button scroll
    $(".top,.top-static").children(".overlay").children(".text").children("button").delegate("", "click", function () {
        var marginT = parseInt($(".body").children(".content").children("div").css("margin-top"));
        $("body").animate({scrollTop: $(".body").children(".content").offset().top - marginT - 70}, 1000);
    });

    //footer
    $(".footer").children(".content").children(".left").children("input").focus(function () {
        $(this).attr("placeholder", "");
    });
    $(".footer").children(".content").children(".left").children("input").blur(function () {
        $(this).attr("placeholder", "Subscribe email to our newsletter...");
    });


    //touch event
    let touchStartX, touchEndX, historyX = 0, currentX = 0, minX, maxX, leftX;
    $(".navbar .menu")[0].addEventListener("touchstart", function (e) {

        if ($(window).width() <= 1100) {
            let left = $(".navbar .menu").css("margin-left");
            left = Number.parseInt(left);
            minX = 0 - left;
            maxX = -$(window).width() * 0.4 - left;
            leftX = left;
            touchStartX = e.changedTouches[0].pageX;
            console.log(minX + "," + maxX);
        }

    }, false);
    $(".navbar .menu")[0].addEventListener("touchmove", function (e) {
        e.preventDefault();
        if ($(window).width() <= 1100) {
            let thisTouchEndX = e.changedTouches[0].pageX;
            let touchMoveX = thisTouchEndX - touchStartX;
            currentX = currentX + touchMoveX;
            historyX += touchMoveX;
            // console.log(historyX);
            if (touchMoveX > minX) {
                return;
            }
            if (touchMoveX < maxX) {
                return;
            }
            setTimeout(()=> {
                $(".navbar .menu").css({"margin-left": touchMoveX + leftX});
            }, 1);
        }
    }, false);

}

//switch language
let currentLang = "en";
if(window.location.hash=="#en"){
    currentLang = "en";
}
if(window.location.hash=="#ch"){
    currentLang = "ch";
    $(".section .title").addClass("section-title-bottom");
}

let switchLanguage = (callback)=> {
    $(".language").children(".lang").delegate("", "click", function () {
        if ($(this).hasClass("en")) {
            currentLang = "en";
            $(".section .title").removeClass("section-title-bottom");
            window.location.hash = "#"+currentLang;
        } else {
            currentLang = "ch";
            $(".section .title").addClass("section-title-bottom");
            window.location.hash = "#"+currentLang;
        }
        callback();
    });
};

//menu nav
$(".navbar .menu a").delegate("", "click", function () {
    let url = $(this).attr("page");
    // let arr1 = [""]
    // url =
    url = "../" + url + "/#" + currentLang;
    window.location.href = url;
});

let isSearching = false;

//load text
let loadText = (page, selectorArr, nameArr)=> {
    selectorArr = selectorArr.concat([".navbar .menu1",".navbar .menu2",".navbar .menu3",".navbar .menu4",".navbar .menu5",".navbar .menu6",".footer button",".footer input"]);
    nameArr = nameArr.concat(["menu1","menu2","menu3","menu4","menu5","menu6","footer-button","footer-input-placeholder"]);
    http.request("../Table/text/Read", "").then(result=> {
        for (let i = 0; i < selectorArr.length; i++) {
            let selector = selectorArr[i];
            let element;
            if (selector.includes(">")) {
                let arr = selector.split(">");
                selector = arr[0];
                let xPath = arr.slice(1).collect("join", ">");
                element = $(selector).xPath(xPath);
            } else {
                element = $(selector);
            }

            element.html(()=> {
                let text = result.filter(d=> {
                    return d.page == page;
                }).filter(d=> {
                    return d.name == nameArr[i];
                }).map(d=> {
                    return d[currentLang];
                }).collect("join", "");
                text = (text == undefined) ? "" : text;
                return text;
            });
            if(selector==".footer input"){
                element.attr("placeholder",(currentLang=="en")?"Subscribe email to our newsletter...":"电子邮箱");
            }

            if(currentLang=="ch"){
                element.addClass("yahei");
            }else{
                element.removeClass("yahei");
            }
        }


        let search = ()=> {
            if ($(window).width() >= 1100) {
                let keyText = $(".navbar .search input").val();
                keyText = keyText.toLowerCase();
                if (keyText == "") {
                    $(".search-panel-body").html("");
                    $(".navbar .search input").focus();
                    return;
                }

                let data = result.filter(d=> {
                    return d[currentLang].toLowerCase().includes(keyText);
                }).map(d=> {
                    let html = "<a href='../" + d.page.replace("-", "_") + "/'>";
                    let maxDisplay = 150;
                    let dotsHtml = (d[currentLang].length > maxDisplay) ? "..." : "";
                    //find matched string and set maxlength
                    let maxLeftLength = 18;
                    let startIndex = d[currentLang].toLowerCase().indexOf(keyText);
                    let matchedText = d[currentLang].substr(startIndex);
                    let matchedTextMaxLength = matchedText.length > maxLeftLength ? maxLeftLength : matchedText.length;
                    let lastSpaceIndex = 0;
                    for (let i = 0; i < matchedTextMaxLength; i++) {
                        if (matchedText[i] == " ") {
                            lastSpaceIndex = i;
                        }
                    }
                    if (lastSpaceIndex == 0) {
                        matchedText = d[currentLang].substr(startIndex);
                    } else {
                        matchedText = d[currentLang].substr(startIndex, lastSpaceIndex);
                    }


                    html += "<div class='big'>" + matchedText.toUpperCase().replace(new RegExp(/<BR>/g), " ") + "</div>";
                    html += "<div class='small'>" + d[currentLang].substr(0, maxDisplay).toLowerCase().replace(new RegExp(/<br>/g), " ") + dotsHtml + "</div>";
                    html += "</a>";
                    return html;
                });


                let n = Number.parseInt((data.length - 1) / 8);
                let paginationStr = "1/" + Number.parseInt(n + 1);
                let displayData = data.slice(0, 8);
                let searchDataHtml = displayData.collect("join", "");
                let closeHtml = "<i class='fa fa-times' aria-hidden='true'></i>";
                let searchHeadHtml = "<div class='search-head'><div class='brand'></div><div class='paginationStr'>PAGE " + paginationStr + "</div></div>";
                let paginationHtml = "<div class='pagination'><button class='previous'>< PREVIOUS</button><button class='next'>NEXT ></button></div>";


                $(".search-panel").slideDown();
                $(".search-panel").html(closeHtml + searchHeadHtml + "<div class='search-panel-body'>" + searchDataHtml + "</div>" + paginationHtml);
                $(".search-panel").children(".fa-times").delegate("", "click", function () {
                    $(".search-panel").slideUp();
                });

                let currentPaginationIndex = 0;
                $(".search-panel").children(".pagination").children("button").delegate("", "click", function () {
                    if ($(this).hasClass("previous")) {
                        if (currentPaginationIndex == 0) {
                            return;
                        } else {
                            currentPaginationIndex--;
                        }
                        displayData = data.slice(currentPaginationIndex * 8, (currentPaginationIndex + 1) * 8);
                    } else {
                        if (currentPaginationIndex == n) {
                            return;
                        } else {
                            currentPaginationIndex++;
                        }
                        displayData = data.slice(currentPaginationIndex * 8, (currentPaginationIndex + 1) * 8);
                    }
                    searchDataHtml = displayData.collect("join", "");
                    $(".search-panel-body").html(searchDataHtml);
                    $(".paginationStr").html("PAGE " + Number.parseInt(currentPaginationIndex + 1) + "/" + Number.parseInt(n + 1));
                });
            } else {
                //
                $("body").css({
                    "overflow-y": "hidden"
                });
                $(".navbar .icon").hide();
                $(".navbar .language").hide();
                $(".navbar .menu").hide();

                $(".navbar .search input").show();
                $(".navbar .search input").fit(()=> {
                    $(".navbar .search input").css({
                        "padding-right": "0",
                        "width": $(window).width() * 0.9 - $(".navbar .search button").width() - 30 - 20
                    });
                });


                $(".navbar .search").css({
                    "background-color": "white",
                    "width": "90%",
                    "right": "0",
                    "margin-left": "5%",
                    "margin-right": "5%",
                    "line-height": "40px",
                    "z-index": 1
                });
                $(".navbar .search img").css({
                    "position": "absolute",
                    "left": "-4px",
                    "top": "5px"
                });
                $(".navbar .search button").css({
                    "margin-top": "8px"
                });

                $(".back-to-top").hide();

                isSearching = true;
                $(".navbar .search button").show();
                //cancel button
                $(".navbar .search button").delegate("", "click", function () {
                    $(".navbar .search input").hide();
                    $(".navbar .search button").hide();
                    $(".navbar .search").css({
                        "width": "auto",
                        "right": "90px",
                    });
                    $(".navbar .search img").css({
                        "position": "static",
                    });
                    isSearching = false;
                    $(".search-panel").hide();
                    if ($(window).scrollTop() != 0) {
                        $(".back-to-top").show();
                    }

                    $("body").css({
                        "overflow-y": "auto"
                    });
                    $(".navbar .icon").show();
                    $(".navbar .language").show();
                    $(".navbar .menu").show();


                });
                $(".search-panel").show();
                $(".search-panel").height($(window).height() - 70);


                let hotSearch = ["heroes", "radium", "xixi", "a"];
                let hotSearchHtmlArr = hotSearch.map(d1=> {
                    let keyText = d1;
                    let data = result.filter(d=> {
                        return d[currentLang].toLowerCase().includes(keyText);
                    }).map(d=> {
                        let html = "<a href='../" + d.page.replace("-", "_") + "/'>";
                        let maxDisplay = 20;
                        let dotsHtml = (d[currentLang].length > maxDisplay) ? "..." : "";
                        //find matched string and set maxlength
                        let maxLeftLength = 18;
                        let startIndex = d[currentLang].toLowerCase().indexOf(keyText);
                        let matchedText = d[currentLang].substr(startIndex);
                        let matchedTextMaxLength = matchedText.length > maxLeftLength ? maxLeftLength : matchedText.length;
                        let lastSpaceIndex = 0;
                        for (let i = 0; i < matchedTextMaxLength; i++) {
                            if (matchedText[i] == " ") {
                                lastSpaceIndex = i;
                            }
                        }
                        if (lastSpaceIndex == 0) {
                            matchedText = d[currentLang].substr(startIndex);
                        } else {
                            matchedText = d[currentLang].substr(startIndex, lastSpaceIndex);
                        }

                        d = d[currentLang].substr(0, maxDisplay).toLowerCase().replace(new RegExp(/<br>/g), " ");
                        return d;
                    });
                    data = (data == undefined) ? "" : data[0];
                    data = (data == undefined) ? "" : data;
                    d1 = "<div class='li'><div class='img'><img src='../Modules/common/image/hot-arrow.png'></div><div class='text'><div class='big'>" + d1.toUpperCase() + "</div><div class='small'>" + data + "</div></div></div>";
                    return d1;
                });
                $(".navbar .search-panel").html(()=> {
                    let hotSearchHtml = hotSearchHtmlArr.map(d=> {
                        d = "<div class='search-list'>" + d + "</div>";
                        return d;
                    }).collect("join", "");
                    return "<div class='hot'><div class='title'>WHAT'S HOT</div>" + hotSearchHtml + "</div>";
                });

                $(".navbar .search-panel .li").delegate("", "click", function () {
                    $(".navbar .search input").val($(this).children(".text").children(".big").text());
                    search();
                });

                let keyText = $(".navbar .search input").val();
                keyText = keyText.toLowerCase();
                if (keyText == "") {
                    return;
                }

                let data = result.filter(d=> {
                    return d[currentLang].toLowerCase().includes(keyText);
                }).map(d=> {
                    let html = "<a href='../" + d.page.replace("-", "_") + "/'>";
                    let maxDisplay = 150;
                    let dotsHtml = (d[currentLang].length > maxDisplay) ? "..." : "";
                    //find matched string and set maxlength
                    let maxLeftLength = 18;
                    let startIndex = d[currentLang].toLowerCase().indexOf(keyText);
                    let matchedText = d[currentLang].substr(startIndex);
                    let matchedTextMaxLength = matchedText.length > maxLeftLength ? maxLeftLength : matchedText.length;
                    let lastSpaceIndex = 0;
                    for (let i = 0; i < matchedTextMaxLength; i++) {
                        if (matchedText[i] == " ") {
                            lastSpaceIndex = i;
                        }
                    }
                    if (lastSpaceIndex == 0) {
                        matchedText = d[currentLang].substr(startIndex);
                    } else {
                        matchedText = d[currentLang].substr(startIndex, lastSpaceIndex);
                    }


                    html += "<div class='big'>" + matchedText.toUpperCase().replace(new RegExp(/<BR>/g), " ") + "</div>";
                    html += "<div class='small'>" + d[currentLang].substr(0, maxDisplay).toLowerCase().replace(new RegExp(/<br>/g), " ") + dotsHtml + "</div>";
                    html += "</a>";
                    return html;
                });
                let displayData = data.slice(0, 8);
                let searchDataHtml = displayData.collect("join", "");
                let paginationHtml = "<div class='pagination'><button class='previous'>< PREVIOUS</button><button class='next'>NEXT ></button></div>";
                $(".search-panel").html("<div class='search-panel-body'>" + searchDataHtml + "</div>" + paginationHtml);

                let currentPaginationIndex = 0;
                let n = Number.parseInt((data.length - 1) / 8);
                $(".search-panel .previous").hide();
                $(".search-panel").children(".pagination").children("button").delegate("", "click", function () {
                    if ($(this).hasClass("previous")) {
                        if (currentPaginationIndex == 0) {
                            return;
                        } else {
                            if (currentPaginationIndex == 1) {
                                $(".search-panel .previous").hide();
                            } else {
                                $(".search-panel .previous").show();
                            }
                            $(".search-panel .next").show();
                            currentPaginationIndex--;
                        }
                        displayData = data.slice(currentPaginationIndex * 8, (currentPaginationIndex + 1) * 8);
                    } else {
                        if (currentPaginationIndex == n) {
                            return;
                        } else {
                            if (currentPaginationIndex == n - 1) {
                                $(".search-panel .next").hide();
                            } else {
                                $(".search-panel .next").show();
                            }
                            $(".search-panel .previous").show();
                            currentPaginationIndex++;
                        }
                        displayData = data.slice(currentPaginationIndex * 8, (currentPaginationIndex + 1) * 8);
                    }
                    searchDataHtml = displayData.collect("join", "");
                    $(".search-panel-body").html(searchDataHtml);
                });
            }


        };

        $(".navbar .search input").delegate("", "input", ()=> {
            search();
        });
        $(".navbar .search img").delegate("", "click", ()=> {
            search();
        });

    }).catch(result=> {
        alert("loading data error,please refresh this page");
    });

    //back to top button
    $(".back-to-top").children("i").delegate("", "click", function () {
        $("html,body").animate({"scrollTop": 0}, 1000);
    });
    if ($(window).scrollTop() == 0) {
        $(".back-to-top").fadeOut();
    } else {
        $(".back-to-top").fadeIn();
    }
    $(window).scroll(function () {
        if ($(window).scrollTop() == 0 || isSearching) {
            $(".back-to-top").fadeOut();
        } else {
            $(".back-to-top").fadeIn();
        }
    })
}
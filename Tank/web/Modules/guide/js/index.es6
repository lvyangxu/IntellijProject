/**
 * Created by karl on 2016/7/22.
 */
{
    let articleText2 = [];


    http.doAjaxInJquery("../Table/guide/Read", "post", 30, "", result=> {
        let json = new myString(result).toJson();
        if (json.success == "true") {
            let data = json.message;

            let currentPage = 0;
            let start = 0;
            let rouPerPage = 4;
            let end = Math.floor((data.length - 1) / rouPerPage);

            let drawArticle = ()=> {
                //draw first five article
                let displayData = data.map((d,i)=> {
                    let id = d.name.replace("guide", "");
                    let content = d.content;
                    content = content.replace(/\{img:[^{}]+}/g, "");

                    let maxLength = 600;
                    if ($(window).width() < 768 && $(window).width() >= 480) {
                        maxLength = 100;
                    } else if($(window).width() < 480){
                        maxLength = 50;
                    }
                    content = (content.length > maxLength) ? (content.substr(0, maxLength) + "...") : content;
                    let rowHtml = "<div class='article'><a href='../detail/?name=" + d.name + "'><div class='left'>";
                    rowHtml += "<img src='../home/image/guideImage" + id + ".png'>";
                    rowHtml += "</div><div class='right'>";
                    rowHtml += "<div class='text1'>" + d.title + "</div>";
                    rowHtml += "<div class='text2'>" + content + "</div>";
                    rowHtml += "</div></a></div>";
                    return rowHtml;
                }).slice(currentPage * rouPerPage, currentPage * rouPerPage + rouPerPage);
                $(".middle").children(".container").html(displayData.slice(0, 3).join(""));
                $(".foot").children(".container").html(displayData.slice(3, rouPerPage).join(""));
            }

            let drawPagination = ()=> {
                //draw pagination
                $(".foot").children(".container").append(()=> {
                    let pageStart, pageEnd;
                    if (currentPage - 2 >= start) {
                        pageStart = currentPage - 2;
                        if (currentPage + 1 <= end) {
                            pageEnd = currentPage + 1;
                        } else {
                            pageEnd = end;
                            if (pageEnd - 3 >= 0) {
                                pageStart = pageEnd - 3;
                            } else {
                                pageStart = start;
                            }

                        }
                    } else {
                        pageStart = start;
                        if (pageStart + 3 <= end) {
                            pageEnd = pageStart + 3;
                        } else {
                            pageEnd = end;
                        }
                    }


                    let paginationHtml = "<div class='pagination'>";
                    paginationHtml += "<button class='start'> << В начало</button>";
                    paginationHtml += "<button class='prev'><</button>";

                    for (let i = pageStart; i <= pageEnd; i++) {
                        let classHtml = (i == currentPage) ? " active" : "";
                        paginationHtml += "<button class='number" + classHtml + "'>" + (i + 1) + "</button>";
                    }
                    paginationHtml += "<button class='next'>></button>";
                    paginationHtml += "<button class='end'>До конца >> </button>";
                    paginationHtml += "</div>";
                    return paginationHtml;
                });

                //delegate pagination button
                $(".pagination").children("button").delegate("", "click", function () {
                    if ($(this).hasClass("start")) {
                        currentPage = 0;
                    }
                    if ($(this).hasClass("end")) {
                        currentPage = end;
                    }
                    if ($(this).hasClass("prev")) {
                        if (currentPage > 0) {
                            currentPage--;
                        } else {
                            return;
                        }
                    }
                    if ($(this).hasClass("next")) {
                        if (currentPage < end) {
                            currentPage++;
                        } else {
                            return;
                        }
                    }
                    if($(this).hasClass("number")){
                        currentPage = Number.parseInt($(this).text())-1;
                    }
                    drawArticle();
                    drawPagination();
                });
            }

            drawArticle();
            drawPagination();



        }
    }, result=> {
        alert("network error:" + result);
    });



    let setFoot = ()=> {
        if ($(window).width() < 768 && $(window).width() >= 480) {
            $(".article").children("a").children(".right").children(".text2").each(function (index) {
                let short = $(this).text().substr(0, 100) + "...";
                $(this).text(short);
            });
        } else if($(window).width() < 480){
            $(".article").children("a").children(".right").children(".text2").each(function (index) {
                let short = $(this).text().substr(0, 50) + "...";
                $(this).text(short);
            });
        } else {
            $(".article").children("a").children(".right").children(".text2").each(function (index) {
                $(this).html(articleText2[index]);
            });
        }

        $(".foot2").height();
    };

    $(window).resize(()=> {
        setFoot();
    });

}
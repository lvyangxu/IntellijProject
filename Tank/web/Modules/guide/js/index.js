"use strict";

/**
 * Created by karl on 2016/7/22.
 */
{
    http.doAjaxInJquery("../Table/guide/Read", "post", 30, "", function (result) {
        var json = new myString(result).toJson();
        if (json.success == "true") {
            (function () {
                var data = json.message;

                var currentPage = 0;
                var start = 0;
                var end = Math.floor((data.length - 1) / 5);

                var drawArticle = function drawArticle() {
                    //draw first five article
                    var displayData = data.map(function (d) {
                        var id = d.name.replace("guide", "");
                        var content = d.content;
                        content = content.replace(/\{img:[^{}]+}/g, "");
                        content = content > 200 ? content.substr(0, 200) + "..." : content;
                        var rowHtml = "<div class='article'><a href='../detail/?name=" + d.name + "'><div class='left'>";
                        rowHtml += "<img src='../Images/manage/guide" + id + "_0.png'>";
                        rowHtml += "</div><div class='right'>";
                        rowHtml += "<div class='text1'>" + d.title + "</div>";
                        rowHtml += "<div class='text2'>" + content + "</div>";
                        rowHtml += "</div></a></div>";
                        return rowHtml;
                    }).slice(currentPage * 5, currentPage * 5 + 5);
                    $(".middle").children(".container").html(displayData.slice(0, 3).join(""));
                    $(".foot").children(".container").html(displayData.slice(3, 5).join(""));
                };

                var drawPagination = function drawPagination() {
                    //draw pagination
                    $(".foot").children(".container").append(function () {
                        var pageStart = void 0,
                            pageEnd = void 0;
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

                        var paginationHtml = "<div class='pagination'>";
                        paginationHtml += "<button class='start'> << First</button>";
                        paginationHtml += "<button class='prev'><</button>";

                        for (var i = pageStart; i <= pageEnd; i++) {
                            var classHtml = i == currentPage ? " active" : "";
                            paginationHtml += "<button class='number" + classHtml + "'>" + (i + 1) + "</button>";
                        }
                        paginationHtml += "<button class='next'>></button>";
                        paginationHtml += "<button class='end'>Last >> </button>";
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
                        if ($(this).hasClass("number")) {
                            currentPage = Number.parseInt($(this).text()) - 1;
                        }
                        drawArticle();
                        drawPagination();
                    });
                };

                drawArticle();
                drawPagination();
            })();
        }
    }, function (result) {
        alert("network error:" + result);
    });
}

//# sourceMappingURL=index.js.map
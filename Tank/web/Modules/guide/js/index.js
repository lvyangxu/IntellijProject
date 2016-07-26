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
                }).slice(0, 5);
                $(".middle").children(".container").html(displayData.slice(0, 3).join(""));
                $(".foot").children(".container").html(displayData.slice(3, 5).join(""));

                //draw pagination
                $(".foot").children(".container").append(function () {
                    var length = Math.ceil(data.length / 5);
                    length = length > 5 ? 5 : length;
                    var paginationHtml = "<div class='pagination'>";
                    paginationHtml += "<button class='start'><<</button>";
                    paginationHtml += "<button class='prev'><</button>";
                    paginationHtml += "<input value='1'>";
                    paginationHtml += "<button class='next'>></button>";
                    paginationHtml += "<button class='end'>>></button>";
                    paginationHtml += "</div>";
                    return paginationHtml;
                });
            })();
        }
    }, function (result) {
        alert("network error:" + result);
    });
}

//# sourceMappingURL=index.js.map
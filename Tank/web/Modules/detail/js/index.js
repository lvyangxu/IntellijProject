"use strict";

/**
 * Created by karl on 2016/7/25.
 */
{
    if (window.location.href.indexOf("?name=") != -1) {
        (function () {
            var regex = /\?name=.*/g;
            var name = window.location.href.match(regex)[0];
            name = name.replace(/\?name=/g, "");

            //draw svg
            var w = $(window).width();
            var pointArr = [{ "x": 210, "y": 0 }, { "x": 190, "y": 30 }, { "x": 277, "y": 0 }];
            if (w < 1330) {
                pointArr = pointArr.map(function (d) {
                    d.x = (d.x * w / 1330).toFixed(2);
                    d.y = (d.y * w / 1330).toFixed(2);
                    return d;
                });
            }
            $(".left").children(".bottomImage").html(function () {
                var pathHtml = pointArr.map(function (d) {
                    d = "L" + d.x + " " + d.y + " ";
                    return d;
                }).join("");
                pathHtml = "M" + pathHtml.substr(1);
                var svgHtml = "<svg><path d='" + pathHtml + "'/></svg>";
                return svgHtml;
            });

            //load data
            http.doAjaxInJquery("../Table/article/Read", "post", 30, "name=" + name, function (result) {
                var json = new myString(result).toJson();
                if (json.success == "true") {
                    (function () {
                        var data = json.message;

                        //set left data
                        $(".left").children(".list").children(".more").before(function () {
                            var rowNameArr = ["news1", "news2", "activity1", "activity2"];
                            var leftHtml = rowNameArr.map(function (d) {
                                var row = data.find(function (d1) {
                                    return d1.name == d;
                                });
                                var rowHtml = "<a href='?name=" + d + "'>" + row.title + "</a>";
                                rowHtml = "<div class='row'>" + rowHtml + "</div>";
                                return rowHtml;
                            }).join("");
                            return leftHtml;
                        });

                        //set right data
                        $(".right").html(function () {
                            var d = data.find(function (d) {
                                return d.name == name;
                            });
                            if (d == undefined) {
                                return;
                            }

                            var rowHtml = "<div class='title'>" + d.title + "</div>";
                            rowHtml += "<div class='line'></div>";
                            //replace img html
                            var regex = /\{img:[^{}]+}/g;
                            var content = d.content;
                            var matchArr = content.match(regex);
                            if (matchArr != null) {
                                matchArr.map(function (d) {
                                    d = d.replace("{img:", "").replace("}", "");
                                    d = "<div><img src='../Images/manage/" + d + "'></div>";
                                    return d;
                                }).forEach(function (d) {
                                    content = content.replace(/\{img:[^{}]+}/, d);
                                });
                            }

                            rowHtml += "<div class='content'>" + content + "</div>";
                            return rowHtml;
                        });
                    })();
                }
            }, function (result) {
                alert("network error:" + result);
            });
        })();
    }
}

//# sourceMappingURL=index.js.map
/**
 * Created by karl on 2016/7/25.
 */
{
    if (window.location.href.indexOf("?name=") != -1) {
        let regex = /\?name=.*/g;
        let name = window.location.href.match(regex)[0];
        name = name.replace(/\?name=/g, "");

        //draw svg
        let w = $(window).width();
        let pointArr = [{"x": 210, "y": 0}, {"x": 190, "y": 30}, {"x": 277, "y": 0}];
        if (w < 1330) {
            pointArr = pointArr.map(d=> {
                d.x = (d.x * w / 1330).toFixed(2);
                d.y = (d.y * w / 1330).toFixed(2);
                return d;
            });
        }
        $(".left").children(".bottomImage").html(()=> {
            let pathHtml = pointArr.map(d=> {
                d = "L" + d.x + " " + d.y + " ";
                return d;
            }).join("");
            pathHtml = "M" + pathHtml.substr(1);
            let svgHtml = "<svg><path d='" + pathHtml + "'/></svg>";
            return svgHtml;
        });

        //load data
        http.doAjaxInJquery("../Table/article/Read", "post", 30, "name=" + name, result=> {
            let json = new myString(result).toJson();
            if (json.success == "true") {
                let data = json.message;

                //set left data
                $(".left").children(".list").children(".more").before(()=> {
                    let rowNameArr = ["news1", "news2", "activity1", "activity2"];
                    let leftHtml = rowNameArr.map(d=> {
                        let row = data.find(d1=> {
                            return d1.name == d;
                        });
                        let rowHtml = "<a href='?name=" + d + "'>" + row.title + "</a>";
                        rowHtml = "<div class='row'>" + rowHtml + "</div>";
                        return rowHtml;
                    }).join("");
                    return leftHtml;
                });

                //set right data
                $(".right").html(()=> {
                    let d = data.find(d=> {
                        return d.name == name;
                    });
                    if(d==undefined){
                        return;
                    }

                    let rowHtml = "<div class='title'>" + d.title + "</div>";
                    rowHtml += "<div class='line'></div>";
                    //replace img html
                    let regex = /\{img:[^{}]+}/g;
                    let content = d.content;
                    let matchArr = content.match(regex);
                    if(matchArr!=null){
                        matchArr.map(d=> {
                            d = d.replace("{img:", "").replace("}", "");
                            d = "<div><img src='../Images/manage/" + d + "'></div>";
                            return d;
                        }).forEach(d=>{
                            content = content.replace(/\{img:[^{}]+}/,d);
                        });
                    }

                    rowHtml += "<div class='content'>" + content + "</div>";
                    return rowHtml;
                });
            }
        }, result=> {
            alert("network error:" + result);
        });
    }


}
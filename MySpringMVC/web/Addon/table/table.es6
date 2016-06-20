/**
 * demo like below
 * <div class='table'>
 *     <div key='id'>id</div>
 * </div>
 */
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function ($) {
    'use strict';
    $.fn.table = function (options) {
        return this.each(()=> {
            table($(this), options);
        });
    };

    let table = (element, options)=> {
        //default setting
        let settings = element.addonSettingExtend(options, {
            //func column,all default true
            funcColumn: {
                "checkbox": (element.attr("checkbox") == "false") ? false : true,
                "lineNumber": (element.attr("lineNumber") == "false") ? false : true
            },
            url: element.attr("url"),
            rowPerPageArr: [5, 10, 15, 20, 25, 50, 100],
            displayRowNum: 5,
            currentRowIndex: 1,
            //a tbody row height
            rowHeight: 40
        });

        //table node
        let node = {
            table(){
                return element.children("table");
            },
            thead(){
                return element.xPath("table>thead");
            },
            tbody(){
                return element.xPath("table>tbody");
            },
            left(){
                return element.xPath(".left");
            },
            right(){
                return element.xPath(".right");
            },
            request(){
                return element.xPath(".left>.request");
            },
            filter(){
                return element.xPath(".left>.filter");
            },
            rowPerPageSelect(){
                return element.xPath(".right>.rowPerPage>select");
            },
            progress(){
                return element.xPath(".right>.progress");
            }
        }

        //table functions
        let func = {
            noData(){
                node.tbody().html(()=> {
                    let tbodyHtml = "<tr><td colspan='" + settings.colNum + "'>there is not any matched data</td></tr>";
                    return tbodyHtml;
                });
            },
            errorData(){
                node.tbody().html(()=> {
                    let tbodyHtml = "<tr><td colspan='" + settings.colNum + "'>an error occured when getting data</td></tr>";
                    return tbodyHtml;
                });
            },
            loading(){
                node.tbody().html(()=> {
                    let tbodyHtml = "<tr><td colspan='" + settings.colNum + "'><i class='fa fa-refresh'></i></td></tr>";
                    return tbodyHtml;
                });
            },
            drawTbody(){
                //draw row data
                let rowNum = 1;
                let tbodyHtml = settings.data.map(d=> {
                    let trHtml = settings.funcColumn.checkbox ? "<td class='func'><input type='checkbox'></td>" : "";
                    trHtml += settings.funcColumn.lineNumber ? "<td class='func'>" + rowNum + "</td>" : "";
                    settings.th.map(d1=> {
                        let k = d1.id;
                        let v = (d[k] == undefined) ? "" : d[k];
                        trHtml += "<td name='" + k + "'>" + v + "</td>";
                    });
                    trHtml = "<tr row='" + rowNum + "'>" + trHtml + "</tr>";
                    rowNum++;
                    return trHtml;
                }).join("");
                node.tbody().html(tbodyHtml);
            },
            mouseScroll(e){
                //prevent browser scroll
                e.preventDefault();
                let lastIndex = settings.currentRowIndex;
                let deltaY = e.originalEvent.deltaY;
                if (deltaY < 0) {
                    //scroll up
                    if (settings.currentRowIndex > 1) {
                        settings.currentRowIndex--;
                        func.scrollTbody(lastIndex);
                        func.setProgress();
                    }
                } else {
                    //scroll down
                    if (settings.data != undefined) {
                        if (settings.currentRowIndex < settings.data.length - settings.displayRowNum + 1) {
                            settings.currentRowIndex++;
                            func.scrollTbody(lastIndex);
                            func.setProgress();
                        }
                    }
                }
            },
            scrollTbody(lastIndex){
                let i = settings.currentRowIndex;
                if (i == lastIndex) {
                    return;
                }
                if (lastIndex > settings.currentRowIndex) {
                    while (i <= lastIndex) {
                        node.tbody().children("tr[row=" + (i - 1) + "]").slideDown(50);
                        i++;
                    }
                } else {
                    while (i >= lastIndex) {
                        node.tbody().children("tr[row=" + (i - 1) + "]").slideUp(50);
                        i--;
                    }
                }

            },
            setProgress(){
                let total = settings.data.length;
                let h = settings.displayRowNum;
                let percent;
                if (total > h) {
                    percent = (settings.currentRowIndex - 1) / (total - h);
                } else {
                    percent = 0;
                }
                percent = percent > 1 ? 1 : percent;
                node.progress().children(".text").text((percent * 100).toFixed(2) + "%");
                let w = (node.progress().width() - 2) * percent;
                node.progress().children(".current").width(w);
            },
            setTbodyHeight(){
                //set element height
                let leftH = node.left().outerHeight(true);
                let theadH = node.thead().outerHeight(true);
                let h = settings.displayRowNum;
                let total;
                if (settings.data != undefined && settings.data.length != undefined) {
                    h = (h > settings.data.length) ? settings.data.length : h;
                    total = settings.data.length;
                } else {
                    h = 1;
                    total = 1;
                }
                let tbodyH = h * settings.rowHeight;
                element.height(leftH + theadH + tbodyH + 1);


            },
            listenTbodyCheckbox(){
                //listen tbody checkbox
                node.tbody().xPath("tr>td.func>input[type=checkbox]").delegate("", "click", function () {
                    if ($(this).prop("checked")) {
                        $(this).prop({"checked": true});
                        $(this).parent().parent().addClass("active");
                    } else {
                        $(this).prop({"checked": false});
                        $(this).parent().parent().removeClass("active");
                    }
                });
            },
            read(){
                func.loading();
                http.request(settings.url, "").then(result=> {
                    settings.data = result;
                    func.drawTbody();
                    func.setTbodyHeight();
                    func.listenTbodyCheckbox();
                }).catch(result=> {
                    func.errorData();
                    throw result;
                });
            }
        }

        //table init
        element.addonInit("table", function () {
            //get thead
            settings.th = [];
            element.children("div[key]").each(function () {
                settings.th.push({
                    id: $(this).attr("key"),
                    name: $(this).text(),
                    hide: $(this).has("hide")
                });
            });
            let theadContentHtml = settings.th.map(d=> {
                d = "<th class='content' name='" + d.id + "'>" + d.name + "</th>";
                return d;
            }).join("");
            let theadHtml = "<thead><tr>";
            theadHtml += settings.funcColumn.checkbox ? "<th class='func'><input type='checkbox'></th>" : "";
            theadHtml += settings.funcColumn.lineNumber ? "<th class='func'>line</th>" : "";
            theadHtml += theadContentHtml + "</tr></thead>";

            //colNum
            let funcColumnLength = 0;
            for (let k in settings.funcColumn) {
                if (settings.funcColumn[k]) {
                    funcColumnLength++;
                }
            }
            settings.colNum = settings.th.length + funcColumnLength;

            //append html
            element.append(()=> {
                let requestHtml = "<div class='request'>";
                requestHtml += "<button class='read button-info'><i class='fa fa-refresh'></i></button>";
                requestHtml += "<button class='create button-info'><i class='fa fa-plus'></i></button>";
                requestHtml += "</div>";
                let filterHtml = "<div class='filter'>";
                filterHtml += "<div class='column-filter' title='column'></div>";
                filterHtml += "</div>";
                let leftHtml = "<div class='left'>" + requestHtml + filterHtml + "</div>";

                let rowPerPageHtml = settings.rowPerPageArr.map(d=> {
                    d = "<option>" + d + "</option>";
                    return d;
                }).join("");
                rowPerPageHtml = "<div class='rowPerPage'>Row Per Page : <select>" + rowPerPageHtml + "</select></div>";
                let progressHtml = "<div class='progress'><div class='text'>0%</div><div class='current'></div></div>";

                let rightHtml = "<div class='right'>" + rowPerPageHtml + progressHtml + "</div>";

                let tableHtml = "<table>" + theadHtml + "<tbody></tbody></table>";

                return leftHtml + rightHtml + tableHtml;
            });

            //listen column filter
            node.filter().children(".column-filter").select({
                data: settings.th.map(d=> {
                    d.checked = !d.hide;
                    return d;
                }),
                callback: ()=> {
                    node.thead().xPath("tr>th.content").each(function () {
                        let thId = $(this).attr("name");
                        let columnFilterData = node.filter().children(".column-filter").data("data");
                        console.log(columnFilterData.find(d=>{
                            return (d.id == thId);
                        }));
                        let isChecked = columnFilterData.find(d=>{
                           return (d.id == thId);
                        }).checked;
                        if(isChecked){
                            $(this).removeClass("hide");
                        }else{
                            $(this).addClass("hide");
                        }

                    });
                }
            });

            func.noData();

            func.setTbodyHeight();

            //auto do read
            func.read();

            element.data("setting", settings);
        });

        //mouse wheel scroll
        node.table().delegate("", "mousewheel", function (e) {
            func.mouseScroll(e);
        });

        node.progress().delegate("", "mousewheel", function (e) {
            func.mouseScroll(e);
        });

        //listen row per page select
        node.rowPerPageSelect().delegate("", "change", function () {
            settings.displayRowNum = node.rowPerPageSelect().children("option:selected").text();
            func.setTbodyHeight();
            func.setProgress();
        });

        //listen read button
        node.request().xPath(".read").delegate("", "click", function () {
            func.read();
        });

        //listen thead checkbox
        node.thead().xPath("tr>th.func>input[type=checkbox]").delegate("", "click", function () {
            if ($(this).prop("checked")) {
                node.tbody().xPath("tr>td.func>input[type=checkbox]").prop({"checked": true});
                node.tbody().children("tr").addClass("active");
            } else {
                node.tbody().xPath("tr>td.func>input[type=checkbox]").prop({"checked": false});
                node.tbody().children("tr").removeClass("active");
            }
        });

        //listen progress click
        node.progress().delegate("", "click", function (e) {
            let clickPercent = (e.clientX - $(this).offset().left) / $(this).width();
            if (settings.data == undefined) {
                return;
            }
            //find the nearest number
            for (let i = 1; i <= settings.data.length; i++) {
                let nodePercent = (i - 1) / (settings.data.length - settings.displayRowNum);
                if (nodePercent >= clickPercent) {
                    let lastIndex = settings.currentRowIndex;
                    settings.currentRowIndex = i;
                    func.scrollTbody(lastIndex);
                    func.setProgress();
                    break;
                }
            }
        });

        return element;
    }

}));
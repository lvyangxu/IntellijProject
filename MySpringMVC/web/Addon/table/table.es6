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
            paginationArr: [5, 10, 15, 20, 25, 50, 100],
            displayRowNum: 5,
            currentRowIndex: 1,
            currentPageIndex: 1,
            //a tbody row height
            rowHeight: 40
        });

        //table node
        let node = {
            thead(){
                return element.xPath("table>thead");
            },
            tbody(){
                return element.xPath("table>tbody");
            },
            view(){
                return element.xPath(".view");
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
            rowPerPageSelect(){
                return element.xPath(".right>.rowPerPage>select");
            },
            pagination(){
                return element.xPath(".right>.pagination");
            },
            pages(){
                return element.xPath(".right>.pagination>.pages");
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
            drawPagination(){
                //draw pagination data
                let currentRowPerPageNum = settings.displayRowNum;
                if (settings.data != undefined) {
                    let pageLength = (settings.data.length - 1) / currentRowPerPageNum + 1;
                    pageLength = (pageLength <= 1) ? 1 : pageLength;
                    let maxDisplayNum = (pageLength > 5) ? 5 : pageLength;
                    let pageHtml = "";
                    for (let i = 1; i < maxDisplayNum; i++) {
                        if (i == settings.currentPageIndex) {
                            pageHtml += "<button class='button-success'>" + i + "</button>";
                        } else {
                            pageHtml += "<button class='button-info'>" + i + "</button>";
                        }
                    }
                    node.pages().html(pageHtml);
                }
            },
            scrollTbody(){


            },
            setTbodyHeight(){
                //set element height
                let leftH = node.left().outerHeight(true);
                let theadH = node.thead().outerHeight(true);
                let displayRowNum = settings.displayRowNum;
                if (settings.data != undefined && settings.data.length != undefined) {
                    displayRowNum = (displayRowNum > settings.data.length) ? settings.data.length : displayRowNum;
                } else {
                    displayRowNum = 1;
                }
                let tbodyH = displayRowNum * settings.rowHeight;
                element.height(leftH + theadH + tbodyH + 1);
                node.view().height(theadH + tbodyH + 1);
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
                http.request(settings.url, "").then(result=> {
                    settings.data = result;
                    settings.currentPageIndex = 1;
                    func.drawTbody();
                    func.setTbodyHeight();
                    func.drawPagination();
                    func.listenTbodyCheckbox();
                }).catch(result=> {
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
                    name: $(this).text()
                });
            });
            let theadContentHtml = settings.th.map(d=> {
                d = "<th class='content' id='" + d.id + "'>" + d.name + "</th>";
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
                let filterHtml = "<div class='filter'><button class='button-info'><i class='fa fa-refresh'></i></button></div>";
                let leftHtml = "<div class='left'>" + requestHtml + filterHtml + "</div>";

                let rowPerPageHtml = settings.paginationArr.map(d=> {
                    d = "<option>" + d + "</option>";
                    return d;
                }).join("");
                rowPerPageHtml = "<div class='rowPerPage'>Row Per Page : <select>" + rowPerPageHtml + "</select></div>";
                let paginationHtml = "<div class='pagination'>";
                paginationHtml += "<button class='button-info'><i class='fa fa-angle-double-left'></i></button>";
                paginationHtml += "<button class='button-info'><i class='fa fa-angle-left'></i></button>";
                paginationHtml += "<div class='pages'><button class='button-success'>1</button></div>";
                paginationHtml += "<button class='button-info'><i class='fa fa-angle-right'></i></button>";
                paginationHtml += "<button class='button-info'><i class='fa fa-angle-double-right'></i></button>";
                paginationHtml += "</div>";
                let rightHtml = "<div class='right'>" + rowPerPageHtml + paginationHtml + "</div>";

                let tableHtml = "<table>" + theadHtml + "<tbody></tbody></table>";

                let viewHtml = "<div class='view'></div>";

                return leftHtml + rightHtml + tableHtml + viewHtml;
            });

            func.noData();

            func.setTbodyHeight();

            //auto do read
            func.read();

            element.data("setting", settings);
        });

        //mouse wheel scroll
        node.tbody().delegate("", "mousewheel", function (e) {
            //prevent browser scroll
            e.preventDefault();

            let deltaY = e.originalEvent.deltaY;
            if (deltaY < 0) {
                //scroll up
                if (settings.currentRowIndex > 1) {
                    settings.currentRowIndex--;
                    node.tbody().children("tr[row=" + settings.currentRowIndex + "]").slideDown(50);
                }
            } else {
                //scroll down
                if (settings.data != undefined) {
                    if (settings.currentRowIndex < settings.data.length - settings.displayRowNum) {
                        node.tbody().children("tr[row=" + settings.currentRowIndex + "]").slideUp(50);
                        settings.currentRowIndex++;
                    }
                }

            }

        });

        //listen row per page select
        node.rowPerPageSelect().delegate("", "change", function () {
            settings.displayRowNum = node.rowPerPageSelect().children("option:selected").text();
            func.setTbodyHeight();
            func.drawPagination();
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

        //listen pagination button
        node.pagination().children("button").delegate("", "click", function () {
            if ($(this).hasClass("fa-angle-double-left")) {
                func.scrollTbody();
            }
            if ($(this).hasClass("fa-angle-left")) {
                if (settings.currentPageIndex > 1) {
                    settings.currentPageIndex--;
                }
                func.scrollTbody();
            }
            if ($(this).hasClass("fa-angle-double-right")) {
                func.scrollTbody();
            }
            if ($(this).hasClass("fa-angle-right")) {
                if (settings.data != undefined) {
                    if (settings.currentPageIndex < settings.data.length) {
                        settings.currentPageIndex++;
                        func.scrollTbody();
                    }
                }
            }
        });


        return element;
    }

}));
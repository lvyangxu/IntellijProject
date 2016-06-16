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
            funcColumn: ["checkbox"],
            url: element.attr("url")
        });

        //table node
        let node = {
            thead(){
                return element.xPath("table>thead");
            },
            tbody(){
                return element.xPath("table>tbody");
            },
            request(){
                return element.xPath(".request");
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
            read(){
                http.request(settings.url, "").then(result=> {
                    console.log(result);
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
            let theadHtml = settings.th.map(d=> {
                d = "<th class='content' id='" + d.id + "'>" + d.name + "</th>";
                return d;
            }).join("");
            theadHtml = "<thead><tr><th><input type='checkbox'></th>" + theadHtml + "</tr></thead>";

            //colNum
            settings.colNum = settings.th.length + settings.funcColumn.length;

            //append html
            element.append(()=> {
                let requestHtml = "<div class='request'><button class='read button-info'><i class='fa fa-refresh'></i></button></div>";
                let filterHtml = "<div class='filter'><button><i class='fa fa-refresh'></i></button></div>";
                let paginationHtml = "<div class='pagination'><button><i class='fa fa-refresh'></i></button></div>";
                let tableHtml = "<table>" + theadHtml + "<tbody></tbody></table>";
                return requestHtml + filterHtml + paginationHtml + tableHtml;
            });

            func.noData();
        });

        node.request().xPath(".read").delegate("","click",function () {
            func.read();
        });

        return element;
    }

}));
/**
 * demo like below
 * <div class='select' title='xxx'>
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
    "use strict";
    $.fn.datepicker = function (options) {
        return this.each(function () {
            datepicker($(this), options);
        });
    };

    let datepicker = function (element, options) {

        let settings = element.addonSettingExtend(options, {
            type: element.property("type", "day"),
            addNum: element.property("add-num", 0)
        });

        let node = {
            panel(){
                return element.xPath(".datepicker-panel");
            }
        };

        let func = {
            setData(){
                settings.dataStr = date.getDateStr(settings.data);
                element.children("input").val(settings.dataStr);
            },
            drawPanelBody(){
                node.panel().xPath(".datepicker-panel-body").html(()=> {
                    let panelBodyHtml = "<div class='week'>";
                    let headStr = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
                    panelBodyHtml += headStr.map(d=> {
                        d = "<div class='week-head'>" + d + "</div>";
                        return d;
                    }).join("");
                    panelBodyHtml += "</div>";

                    let firstStr = settings.dataStr.substr(0, 7) + "-01";
                    let first = date.getDate(firstStr);
                    let daysOfMonth = date.getDaysOfMonth(first);
                    let lastMonthStr = date.toLastMonth(firstStr) + "-01";
                    let daysOflastMonth = date.getDaysOfMonth(date.getDate(lastMonthStr));

                    let first_DayOfWeek = first.getDay();
                    first_DayOfWeek = (first_DayOfWeek == 0) ? 7 : first_DayOfWeek;

                    let start = -first_DayOfWeek + 2;
                    for (let i = 0; i < 6; i++) {
                        let rowHtml = "<div class='row'>";
                        for (let j = 0; j < 7; j++) {
                            let n = i * 7 + j + start;
                            let displayN;
                            let classHtml = "";
                            if (i == 0) {
                                displayN = n < 1 ? (n + daysOflastMonth) : n;
                                classHtml = n < 1 ? " class='disabled'" : "";
                            } else {
                                displayN = n > daysOfMonth ? (n - daysOfMonth) : n;
                                classHtml = n > daysOfMonth ? " class='disabled'" : "";
                            }
                            rowHtml += "<div" + classHtml + ">" + displayN + "</div>";
                        }
                        rowHtml += "</div>";
                        panelBodyHtml += rowHtml;
                    }


                    return panelBodyHtml;
                });
            }
        };

        element.addonInit("datepicker", ()=> {
            let dateStr = date.getLocalDay(settings.addNum);
            dateStr = (settings.type == "month") ? dateStr.substr(0, 7) : dateStr;
            let defaultData = (element.text() == "") ? dateStr : element.text();
            settings.dataStr = defaultData;
            settings.data = date.getDate(defaultData);

            // build html
            element.append(function () {
                let datepickerHtml = "<input><button class='button-info'><i class='fa fa-calendar'></i></button>";
                datepickerHtml += "<div class='datepicker-panel'>";
                datepickerHtml += "<div class='datepicker-panel-head'><i class='fa fa-arrow-circle-left'></i><div class='text'>";
                datepickerHtml += settings.dataStr + "</div><i class='fa fa-arrow-circle-right'></i></div>";
                datepickerHtml += "<div class='datepicker-panel-body'></div>";
                datepickerHtml += "</div>";
                return datepickerHtml;
            });

            func.setData();
            func.drawPanelBody();

            element.children(".button-info").delegate("", "click", function () {
                node.panel().toggle();
            });

            node.panel().xPath(".datepicker-panel-head>.fa-arrow-circle-left").delegate("", "click", function () {

                func.drawPanelBody();
                console.log(typeof(settings.data));
            });

        });

        return element;
    }

}));
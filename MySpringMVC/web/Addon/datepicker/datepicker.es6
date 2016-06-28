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
        return $(this).each(function(){
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
                let dataStr = new date(settings.data).toString();;
                element.children("input").val(dataStr);
                node.panel().xPath(".datepicker-panel-head>.text").text(dataStr);
                element.data("data",settings.data);
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

                    let daysOfMonth = new date(settings.data).toDaysOfMonth();
                    let daysOflastMonth = new date(settings.data).lastMonth().toDaysOfMonth();
                    let first_DayOfWeek = new date(settings.data).firstDay().value.getDay();
                    first_DayOfWeek = (first_DayOfWeek == 0) ? 7 : first_DayOfWeek;

                    let currentDay = settings.data.getDate();
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
                            if(currentDay == n){
                                classHtml = " class='active'";
                            }

                            rowHtml += "<div" + classHtml + ">" + displayN + "</div>";
                        }
                        rowHtml += "</div>";
                        panelBodyHtml += rowHtml;
                    }
                    return panelBodyHtml;
                });

                node.panel().xPath(".datepicker-panel-body>.row>div").delegate("","click",function () {
                    let day = $(this).text();
                    if($(this).hasClass("disabled")){
                        if(day<10){
                            settings.data = new date(settings.data).addMonth(1).value;
                        }
                        if(day>20){
                            settings.data = new date(settings.data).addMonth(-1).value;
                        }
                    }
                    settings.data.setDate(day);
                    func.setData();
                    func.drawPanelBody();
                    node.panel().hide();
                });
            }
        };

        element.addonInit("datepicker", ()=> {
            let dateStr = date.getLocalDay(settings.addNum);
            dateStr = (settings.type == "month") ? dateStr.substr(0, 7) : dateStr;
            let dataStr = (element.text() == "") ? dateStr : element.text();
            settings.data = new date(dataStr).value;

            // build html
            element.append(function () {
                let datepickerHtml = "<input><button class='button-info'><i class='fa fa-calendar'></i></button>";
                datepickerHtml += "<div class='datepicker-panel'>";
                datepickerHtml += "<div class='datepicker-panel-head'><i class='fa fa-arrow-circle-left'></i><div class='text'>";
                datepickerHtml += dataStr + "</div><i class='fa fa-arrow-circle-right'></i></div>";
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
                let date1 = new date(settings.data);
                settings.data = date1.addMonth(-1).value;
                func.setData();
                func.drawPanelBody();
            });

            node.panel().xPath(".datepicker-panel-head>.fa-arrow-circle-right").delegate("", "click", function () {
                let date1 = new date(settings.data);
                settings.data = date1.addMonth(1).value;
                func.setData();
                func.drawPanelBody();
            });

        });

        if(options == undefined){
            return;
        }

        if (options.data != undefined) {
            if(options.data!=""){
                settings.data = options.data;
            }
            func.setData();
        }

        return element;
    }

}));
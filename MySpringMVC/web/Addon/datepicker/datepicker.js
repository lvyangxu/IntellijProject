'use strict';

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
})(function ($) {
    "use strict";

    $.fn.datepicker = function (options) {
        return $(this).each(function () {
            datepicker($(this), options);
        });
    };

    var datepicker = function datepicker(element, options) {

        var settings = element.addonSettingExtend(options, {
            type: element.property("type", "day"),
            addNum: element.property("add-num", 0),
            callback: function callback() {}
        });

        var node = {
            panel: function panel() {
                return element.xPath(".datepicker-panel");
            }
        };

        var func = {
            setData: function setData() {
                var dataStr = new date(settings.data).toString();
                element.children("input").val(dataStr);
                node.panel().xPath(".datepicker-panel-head>.text").text(dataStr);
                element.data("data", settings.data);
            },
            drawPanelBody: function drawPanelBody() {
                node.panel().xPath(".datepicker-panel-body").html(function () {
                    var panelBodyHtml = "<div class='week'>";
                    var headStr = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
                    panelBodyHtml += headStr.map(function (d) {
                        d = "<div class='week-head'>" + d + "</div>";
                        return d;
                    }).join("");
                    panelBodyHtml += "</div>";

                    var daysOfMonth = new date(settings.data).toDaysOfMonth();
                    var daysOflastMonth = new date(settings.data).lastMonth().toDaysOfMonth();
                    var first_DayOfWeek = new date(settings.data).firstDay().value.getDay();
                    first_DayOfWeek = first_DayOfWeek == 0 ? 7 : first_DayOfWeek;

                    var currentDay = settings.data.getDate();
                    var start = -first_DayOfWeek + 2;
                    for (var i = 0; i < 6; i++) {
                        var rowHtml = "<div class='row'>";
                        for (var j = 0; j < 7; j++) {
                            var n = i * 7 + j + start;
                            var displayN = void 0;
                            var classHtml = "";
                            if (i == 0) {
                                displayN = n < 1 ? n + daysOflastMonth : n;
                                classHtml = n < 1 ? " class='disabled'" : "";
                            } else {
                                displayN = n > daysOfMonth ? n - daysOfMonth : n;
                                classHtml = n > daysOfMonth ? " class='disabled'" : "";
                            }
                            if (currentDay == n) {
                                classHtml = " class='active'";
                            }

                            rowHtml += "<div" + classHtml + ">" + displayN + "</div>";
                        }
                        rowHtml += "</div>";
                        panelBodyHtml += rowHtml;
                    }
                    return panelBodyHtml;
                });

                //listen day click
                node.panel().xPath(".datepicker-panel-body>.row>div").delegate("", "click", function () {
                    var day = $(this).text();
                    if ($(this).hasClass("disabled")) {
                        if (day < 10) {
                            settings.data = new date(settings.data).addMonth(1).value;
                        }
                        if (day > 20) {
                            settings.data = new date(settings.data).addMonth(-1).value;
                        }
                    } else {
                        settings.data = new date(settings.data).value;
                    }
                    settings.data.setDate(day);
                    func.setData();
                    func.drawPanelBody();
                    node.panel().hide();
                    settings.callback();
                });
            }
        };

        element.addonInit("datepicker", function () {
            var dateStr = date.getLocalDay(settings.addNum);
            dateStr = settings.type == "month" ? dateStr.substr(0, 7) : dateStr;
            var dataStr = element.text() == "" ? dateStr : element.text();
            settings.data = new date(dataStr).value;

            // build html
            element.append(function () {
                var datepickerHtml = "<input><button class='button-info'><i class='fa fa-calendar'></i></button>";
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
                var date1 = new date(settings.data);
                settings.data = date1.addMonth(-1).value;
                func.setData();
                func.drawPanelBody();
            });

            node.panel().xPath(".datepicker-panel-head>.fa-arrow-circle-right").delegate("", "click", function () {
                var date1 = new date(settings.data);
                settings.data = date1.addMonth(1).value;
                func.setData();
                func.drawPanelBody();
            });

            element.children("input").delegate("", "blur", function () {
                var arr = $(this).val().split("-");
                var lastValue = new date(settings.data).toString();
                if (arr.length != 3) {
                    $(this).val(lastValue);
                    return;
                }
                var year = arr[0];
                var month = arr[1];
                var day = arr[2];

                var yearRegex = /^[1-2][0-9]{3}$/g;
                var monthRegex = /(^[1][0-2]$)|(^[0][1-9]$)|(^[1-9]$)/g;
                var dayRegex = /(^[1-2][0-9]$)|(^[3][0-1]$)|(^[0][1-9]$)|(^[1-9]$)/g;

                if (yearRegex.test(year) && monthRegex.test(month) && dayRegex.test(day)) {
                    settings.data = new date($(this).val()).value;
                    func.setData();
                } else {
                    $(this).val(lastValue);
                }
            });
        });

        if (options == undefined) {
            return;
        }

        if (options.data != undefined) {
            if (options.data != "") {
                settings.data = options.data;
            }
            func.setData();
        }

        return element;
    };
});

//# sourceMappingURL=datepicker.js.map
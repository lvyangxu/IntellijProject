'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
        return this.each(function () {
            datepicker($(this), options);
        });
    };

    var datepicker = function datepicker(element, options) {

        var settings = element.addonSettingExtend(options, {
            type: element.property("type", "day"),
            addNum: element.property("add-num", 0)
        });

        var node = {
            panel: function panel() {
                return element.xPath(".datepicker-panel");
            }
        };

        var func = {
            setData: function setData() {
                settings.dataStr = date.getDateStr(settings.data);
                element.children("input").val(settings.dataStr);
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

                    var firstStr = settings.dataStr.substr(0, 7) + "-01";
                    var first = date.getDate(firstStr);
                    var daysOfMonth = date.getDaysOfMonth(first);
                    var lastMonthStr = date.toLastMonth(firstStr) + "-01";
                    var daysOflastMonth = date.getDaysOfMonth(date.getDate(lastMonthStr));

                    var first_DayOfWeek = first.getDay();
                    first_DayOfWeek = first_DayOfWeek == 0 ? 7 : first_DayOfWeek;

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
                            rowHtml += "<div" + classHtml + ">" + displayN + "</div>";
                        }
                        rowHtml += "</div>";
                        panelBodyHtml += rowHtml;
                    }

                    return panelBodyHtml;
                });
            }
        };

        element.addonInit("datepicker", function () {
            var dateStr = date.getLocalDay(settings.addNum);
            dateStr = settings.type == "month" ? dateStr.substr(0, 7) : dateStr;
            var defaultData = element.text() == "" ? dateStr : element.text();
            settings.dataStr = defaultData;
            settings.data = date.getDate(defaultData);

            // build html
            element.append(function () {
                var datepickerHtml = "<input><button class='button-info'><i class='fa fa-calendar'></i></button>";
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
                console.log(_typeof(settings.data));
            });
        });

        return element;
    };
});

//# sourceMappingURL=datepicker.js.map
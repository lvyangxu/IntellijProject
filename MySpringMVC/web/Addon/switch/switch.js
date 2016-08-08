'use strict';

/**
 * demo like below
 * <div class='switch' name='xxx'>
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

    $.fn.switch = function (options) {
        return $(this).each(function () {
            switchFunc($(this), options);
        });
    };

    var switchFunc = function switchFunc(element, options) {

        var settings = element.addonSettingExtend(options, {
            "name": element.property("name", "select"),
            "title": element.property("title", ""),
            "data": [],
            "callback": function callback() {}
        });

        var node = {
            panel: function panel() {
                return element.children(".select-panel");
            },
            panelHeadCheckbox: function panelHeadCheckbox() {
                return element.xPath(".select-panel>.select-panel-head>input[type=checkbox]");
            },
            panelBodyCheckbox: function panelBodyCheckbox() {
                return element.xPath(".select-panel>.select-panel-body>.group>div>input[type=checkbox]");
            }
        };

        var func = {
            setData: function setData() {
                var checkedNum = settings.data.filter(function (d) {
                    return d.checked;
                }).length;
                var numStr = checkedNum + "/" + settings.data.length;
                node.panel().xPath(".select-panel-head>.text").text(numStr);

                node.panel().children(".select-panel-body").html(function () {
                    var panelHtml = "";
                    for (var i = 0; i <= settings.data.length / 10; i++) {
                        var end = i * 10 + 10 < settings.data.length ? i * 10 + 10 : settings.data.length;
                        var currentArr = settings.data.slice(i * 10, end);

                        panelHtml += "<div class='group'>";
                        panelHtml += currentArr.map(function (d) {
                            var checkedHtml = d.checked ? " checked='checked'" : "";
                            d = "<div optionId='" + d.id + "'><input type='checkbox'" + checkedHtml + "><div class='text'>" + d.name + "</div></div>";
                            return d;
                        }).join("");
                        panelHtml += "</div>";
                    }
                    return panelHtml;
                });

                node.panelBodyCheckbox().delegate("", "click", function () {
                    var _this = this;

                    var optionId = $(this).parent().attr("optionId");
                    settings.data = settings.data.map(function (d) {
                        if (d.id == optionId) {
                            d.checked = $(_this).prop("checked");
                        }
                        return d;
                    });
                    if (settings.callback != undefined) {
                        settings.callback();
                    }
                });

                element.data("data", settings.data);
            }
        };

        element.addonInit("select", function () {

            // build html
            element.append(function () {
                var buttonHtml = "<button class='button-info'>" + settings.name + " <i class='fa fa-check-square-o'></i></button>";
                var panelHtml = "<div class='select-panel'>";
                var allChecked = settings.data.some(function (d) {
                    return !d.checked;
                });
                var allCheckedHtml = allChecked ? "" : " checked='checked'";
                var checkedNum = settings.data.filter(function (d) {
                    return d.checked;
                }).length;
                var numStr = checkedNum + "/" + settings.data.length;
                panelHtml += "<div class='select-panel-head'><input type='checkbox'" + allCheckedHtml + "><div class='text'>" + numStr + "</div></div>";
                panelHtml += "<div class='select-panel-body'>";
                panelHtml += "</div>";
                panelHtml += "</div>";
                return buttonHtml + panelHtml;
            });

            func.setData();

            element.children("button").delegate("", "click", function () {
                node.panel().toggle();
            });

            //listen checkbox
            node.panelHeadCheckbox().delegate("", "click", function () {
                var _this2 = this;

                settings.data = settings.data.map(function (d) {
                    d.checked = $(_this2).prop("checked");
                    return d;
                });
                node.panelBodyCheckbox().prop("checked", $(this).prop("checked"));
                func.setData();
                settings.callback();
            });
        });

        if (options == undefined) {
            return;
        }

        if (options.data != undefined) {
            func.setData();
        }

        return element;
    };
});

//# sourceMappingURL=switch.js.map
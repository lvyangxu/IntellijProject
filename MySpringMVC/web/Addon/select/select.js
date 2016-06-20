'use strict';

/**
 * select js
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

    $.fn.select = function (options) {
        return this.each(function () {
            select($(this), options);
        });
    };

    var select = function select(element, options) {

        var settings = element.addonSettingExtend(options, {
            "title": element.property("title", "select"),
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
                element.data("data", settings.data);
            }
        };

        element.addonInit("select", function () {

            // build html
            element.append(function () {
                var buttonHtml = "<button class='button-info'>" + settings.title + " <i class='fa fa-caret-square-o-down'></i></button>";
                var panelHtml = "<div class='select-panel'>";
                var allChecked = settings.data.some(function (d) {
                    return !d.checked;
                });
                var allCheckedHtml = allChecked ? "" : " checked='checked'";
                panelHtml += "<div class='select-panel-head'><input type='checkbox'" + allCheckedHtml + "><div class='text'>0/0</div></div>";
                panelHtml += "<div class='select-panel-body'>";
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

                panelHtml += "</div>";
                panelHtml += "</div>";
                return buttonHtml + panelHtml;
            });

            element.children("button").delegate("", "click", function () {
                node.panel().toggle();
            });

            //listen checkbox
            node.panelHeadCheckbox().delegate("", "click", function () {
                var _this = this;

                settings.data.map(function (d) {
                    d.checked = $(_this).prop("checked");
                });
                node.panelBodyCheckbox().prop("checked", $(this).prop("checked"));
                func.setData();
                settings.callback();
            });
            node.panelBodyCheckbox().delegate("", "click", function () {
                var optionId = $(this).parent().attr("optionId");
                settings.data.find(function (d) {
                    return d.id = optionId;
                }).checked = $(this).prop("checked");
                func.setData();
                settings.callback();
            });

            //
            // //listen head checkbox
            // head.delegate("input[type=checkbox]", "click", function () {
            //     if (data("data") == undefined) {
            //         return;
            //     }
            //
            //     let checkbox = head.children("input[type=checkbox]");
            //     if (checkbox.prop("checked")) {
            //         var d1 = data("data").map(function (d) {
            //             d.checked = true;
            //             return d;
            //         });
            //         data("data", d1);
            //         label.html("已选中" + data("data").length + "项");
            //         body.children("div").children("input").prop("checked", true);
            //     } else {
            //         var d1 = data("data").map(function (d) {
            //             d.checked = false;
            //             return d;
            //         });
            //         data("data", d1);
            //         label.html("已选中0项");
            //         body.children("div").children("input").prop("checked", false);
            //     }
            //
            //     if (settings.selectCallback != undefined) {
            //         var callback = settings.selectCallback;
            //         callback();
            //     }
            // });
            //
        });

        // // set data
        // if (settings.data != null) {
        //     element.data("data", settings.data);
        //     let data = settings.data;
        //     let bodyHtml = data.map(d=> {
        //         let checkedHtml = d.checked ? "checked='checked'" : "";
        //         d = "<div><input type='checkbox' " + checkedHtml + ">" + (d.name == undefined ? "" : d.name) + "</div>";
        //         return d;
        //     }).collect("join", "");
        //     body.html(bodyHtml);
        //     let n = data.filter(d=> {
        //         return d.checked;
        //     }).length;
        //     label.html("已选中" + n + "项");
        //
        //     //listen checkbox
        //     body.children("div").delegate("input[type=checkbox]", "click", ()=> {
        //         let currentData = [];
        //         body.children("div").children("input").each(function () {
        //             currentData.push({"name": $(this).parent().text(), "checked": $(this).prop("checked")});
        //         });
        //         element.data("data", currentData);
        //         let n = data("data").filter(d=> {
        //             return d.checked;
        //         }).length;
        //         label.html("已选中" + n + "项");
        //         if (settings.selectCallback != null) {
        //             let callback = settings.selectCallback;
        //             callback();
        //         }
        //     });
        // }

        return element;
    };
});

//# sourceMappingURL=select.js.map
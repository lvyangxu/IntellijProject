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
            "title": element.property("title", "multi-select"),
            "data": null,
            "selectCallback": null
        });

        var contain = element.xPath(".contain");
        var panel = element.xPath(".contain>.panel");
        var head = element.xPath(".contain>.panel>.head");
        var label = element.xPath(".contain>.panel>.head>label");
        var body = element.xPath(".contain>.panel>.body");

        element.addonInit("select", function () {

            // build html
            element.append(function () {
                var headHtml = "<div class='head'><input type='checkbox'><label>已选中0项</label></div>";
                var bodyHtml = "<div class='body'></div>";
                var innerHtml = "<div class='contain'>" + "<button class='switch btn btn-info'>" + settings.title + "<i class='fa fa-check-square-o'></i></button>" + "<div class='panel'>" + headHtml + bodyHtml + "</div>" + "</div>";
                return innerHtml;
            });

            //prevent click event bubbling
            element.delegate(".contain", "click", function (event) {
                event.stopPropagation();
            });

            //listen head checkbox
            head.delegate("input[type=checkbox]", "click", function () {
                if (data("data") == undefined) {
                    return;
                }

                var checkbox = head.children("input[type=checkbox]");
                if (checkbox.prop("checked")) {
                    var d1 = data("data").map(function (d) {
                        d.checked = true;
                        return d;
                    });
                    data("data", d1);
                    label.html("已选中" + data("data").length + "项");
                    body.children("div").children("input").prop("checked", true);
                } else {
                    var d1 = data("data").map(function (d) {
                        d.checked = false;
                        return d;
                    });
                    data("data", d1);
                    label.html("已选中0项");
                    body.children("div").children("input").prop("checked", false);
                }

                if (settings.selectCallback != undefined) {
                    var callback = settings.selectCallback;
                    callback();
                }
            });

            // delegate toggle panel
            contain.delegate("button", "click", function () {
                if ($(this).hasClass("switch")) {
                    panel.toggle();
                } else {
                    panel.show();
                }
            });
        });

        // set data
        if (settings.data != null) {
            (function () {
                element.data("data", settings.data);
                var data = settings.data;
                var bodyHtml = data.map(function (d) {
                    var checkedHtml = d.checked ? "checked='checked'" : "";
                    d = "<div><input type='checkbox' " + checkedHtml + ">" + (d.name == undefined ? "" : d.name) + "</div>";
                    return d;
                }).collect("join", "");
                body.html(bodyHtml);
                var n = data.filter(function (d) {
                    return d.checked;
                }).length;
                label.html("已选中" + n + "项");

                //listen checkbox
                body.children("div").delegate("input[type=checkbox]", "click", function () {
                    var currentData = [];
                    body.children("div").children("input").each(function () {
                        currentData.push({ "name": $(this).parent().text(), "checked": $(this).prop("checked") });
                    });
                    element.data("data", currentData);
                    var n = data("data").filter(function (d) {
                        return d.checked;
                    }).length;
                    label.html("已选中" + n + "项");
                    if (settings.selectCallback != null) {
                        var callback = settings.selectCallback;
                        callback();
                    }
                });
            })();
        }

        return element;
    };
});

//# sourceMappingURL=select.js.map
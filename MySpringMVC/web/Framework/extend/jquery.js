"use strict";

/**
 * jquery extend
 */
{
    //addon init
    $.fn.addonInit = function (name, callback) {
        if (!$(this).data("init")) {
            //add class
            if (!$(this).hasClass("addon-" + name)) {
                $(this).addClass("addon-" + name);
            }
            if (callback != undefined) {
                callback($(this));
            }
            $(this).data({ "init": true });
        }
    };

    $.fn.addonSettingExtend = function (options) {
        var currentSetting = $(this).data("setting") || {};
        var settings = $.extend(currentSetting, options);
        $(this).data("setting", settings);
        return settings;
    };

    //get attr
    $.fn.property = function (name, defaultValue) {
        var result = $(this).attr(name);
        if (defaultValue != undefined && result == undefined) {
            result = defaultValue;
        }
        return result;
    };

    //whether element has attr
    $.fn.has = function (name) {
        var result = $(this).attr(name) != undefined;
        return result;
    };

    $.fn.toArray = function (options) {
        var result = [];
        for (var i = 0; i < $(this).length; i++) {
            result.push($($(this)[i]));
        }
        return result;
    };
    $.fn.fit = function (callback) {
        callback();
        $(window).resize(function () {
            callback();
        });
        return $(this);
    };
    $.fn.fullFit = function (delH, callback) {
        var x = $(this).width();
        var y = $(this).height();

        var element = $(this);
        $(this).fit(function () {
            var w = $(window).width();
            var h = $(window).outerHeight(true);

            element.parent().css({
                "height": h - delH + "px"
            }, 2000);

            var offsetX = void 0,
                offsetY = void 0,
                scale = void 0;
            if (x / y > w / h) {
                //too wide,scale<1
                var shouldW = x / y * h;
                scale = shouldW / w;
                offsetX = (w - shouldW) / 2;
                offsetY = 0;
            } else {
                //too high
                var shouldH = y / x * w;
                scale = 1;
                offsetX = 0;
                offsetY = (h - shouldH) / 8;
            }

            element.css({
                "margin-left": offsetX + "px",
                "margin-top": offsetY + "px",
                "width": scale * 100 + "%"
            }, 2000);

            if (callback != undefined) {
                callback();
            }
        });

        return $(this);
    };

    $.fn.xPath = function (xPath) {
        var element = $(this);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = xPath.split(">")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var node = _step.value;

                element = element.children(node);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return element;
    };
}

//# sourceMappingURL=jquery.js.map
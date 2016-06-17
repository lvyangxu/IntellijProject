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
            $(this).data({"init": true});
        } 
    };

    $.fn.addonSettingExtend = function (options, defaultSetting) {
        let currentSetting = $(this).data("setting") || {};
        let settings = $.extend(currentSetting, options);
        $(this).data("setting", settings);
        if (!$(this).data("init") && defaultSetting != undefined) {
            settings = $.extend(defaultSetting, settings);
        }
        return settings;
    }

    //get attr
    $.fn.property = function (name, defaultValue) {
        let result = $(this).attr(name);
        if (defaultValue != undefined && result == undefined) {
            result = defaultValue;
        }
        return result;
    };

    //whether element has attr
    $.fn.has = function (name) {
        let result = ($(this).attr(name) != undefined);
        return result;
    }

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
    $.fn.fullFit = function (delH, callback,noLeft) {

        let element = $(this);
        $(this).fit(()=> {
            let [x,y] = [$(this).width(), $(this).height()]
            let [w,h] = [$(window).width(), $(window).outerHeight(true)];
            element.parent().css({
                "height": h - delH + "px",
            }, 2000);

            let offsetX, offsetY, scale;
            if ((x / y) > (w / h)) {
                //too wide,scale<1
                let shouldW = x / y * h;
                scale = (shouldW / w);
                offsetX = (w - shouldW) / 2;
                offsetY = 0;
            } else {
                //too high
                let shouldH = y / x * w;
                scale = 1;
                offsetX = 0;
                offsetY = (h - shouldH) / 8;
            }

            let style = {
                "margin-top": offsetY + "px",
                "width": (scale) * 100 + "%"
            }
            if(!noLeft){
                style = $.extend(style,{
                    "margin-left": offsetX + "px",
                });
            }

            element.css(style,200);


            if (callback != undefined) {
                callback();
            }
        });

        return $(this);
    }

    $.fn.xPath = function (xPath) {
        let element = $(this);
        for (let node of xPath.split(">")) {
            element = element.children(node);
        }
        return element;
    }
}

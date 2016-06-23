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
            type: element.property("type", "day")
        });

        let node = {};

        let func = {};

        element.addonInit("datepicker", ()=> {

            // build html
            element.append(function () {
                let datepickerHtml = "<input><button class='button-info'><i class='fa fa-calendar'></i></button>";
                return datepickerHtml;
            });

        });

        return element;
    }

}));
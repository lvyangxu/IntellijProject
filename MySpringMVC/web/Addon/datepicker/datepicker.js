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
        return this.each(function () {
            datepicker($(this), options);
        });
    };

    var datepicker = function datepicker(element, options) {

        var settings = element.addonSettingExtend(options, {
            type: element.property("type", "day")
        });

        var node = {};

        var func = {};

        element.addonInit("datepicker", function () {

            // build html
            element.append(function () {
                var datepickerHtml = "<input><button class='button-info'><i class='fa fa-calendar'></i></button>";
                return datepickerHtml;
            });
        });

        return element;
    };
});

//# sourceMappingURL=datepicker.js.map
'use strict';

/**
 * Created by karl on 2016/4/1.
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
    'use strict';

    $.fn.nav = function (options) {
        var _this = this;

        return this.each(function () {
            nav($(_this), options);
        });
    };

    var nav = function nav(element, options) {
        var settings = element.addonSettingExtend(options);

        element.addonInit("nav");

        //listen click
        element.children("div[key]").delegate("", "click", function () {
            window.location.href = "../" + $(this).attr("key") + "/";
        });

        return element;
    };
});

//# sourceMappingURL=nav.js.map
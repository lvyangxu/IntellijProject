'use strict';

/**
 * demo like below
 * <div class='nav'>
 *     <div key='a'>b</div>
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
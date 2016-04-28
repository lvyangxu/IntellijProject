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

        //init section
        element.children(".container").children("div").children("div").each(function (index) {
            if (index == 0) {
                $(this).addClass("active");
            } else {
                var sectionId = $(this).attr("section");
                $("#" + sectionId).hide();
            }
        });

        //set menu div responsive
        element.children(".container").children(".left").fit(function () {
            var w = 0;
            element.children(".container").children(".left").children("div").each(function () {
                w += $(this).width();
            });
            var n = element.children(".container").children(".left").children("div").length;
            var space = (1000 - w) / (n + 1);
            element.children(".container").children(".left").children("div").css({
                "margin-left": space + "px"
            });
        });

        /**
         * menu click
         */
        element.children(".container").children("div").children("div").delegate("", "click", function () {
            //change class
            element.children(".container").children("div").children("div").removeClass("active");
            $(this).addClass("active");

            //change section
            $(this).siblings("div").each(function () {
                var sectionId = $(this).attr("section");
                $("#" + sectionId).hide();
            });
            var sectionId = $(this).attr("section");
            $("#" + sectionId).show();
        });

        return element;
    };
});

//# sourceMappingURL=nav.js.map
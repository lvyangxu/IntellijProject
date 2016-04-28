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

    $.fn.section = function (options) {
        var _this = this;

        return this.each(function () {
            section($(_this), options);
        });
    };

    var section = function section(element, options) {

        var settings = element.addonSettingExtend(options);

        element.addonInit("section", function () {

            //append html
            element.append(function () {
                var menuHtml = "<div class='menu'>";
                var i = 0;
                element.children("div[section]").each(function () {
                    menuHtml += "<div class='li' index='" + i + "'>" + $(this).attr("section") + "</div>";
                    i++;
                });
                menuHtml += "</div>";
                return menuHtml;
            });
        });

        element.children(".menu").children("div").each(function (index) {
            if (index == 0) {
                $(this).addClass("active");
            } else {
                var sectionId = $(this).attr("section");
                $("#" + sectionId).hide();
            }
        });

        /**
         * menu click
         */
        element.children(".menu").children(".li").delegate("", "click", function () {
            //change class
            element.children(".menu").children(".li").removeClass("active");
            $(this).addClass("active");

            //scroll to section
            var scrollTopArr = [];
            var scrollTop = 0;
            element.children("div[section]").each(function () {
                scrollTopArr.push(scrollTop);
                scrollTop += $(this).outerHeight();
            });
            console.log(scrollTopArr);
            var i = $(this).attr("index");
            $("html,body").animate({ "scrollTop": scrollTopArr[i] }, 800);
        });

        return element;
    };
});

//# sourceMappingURL=section.js.map
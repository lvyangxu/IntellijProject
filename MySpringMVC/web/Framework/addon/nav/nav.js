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

}(function ($) {
    'use strict';
    $.fn.nav = (options)=> {
        return this.each(()=> {
            nav($(this), options);
        });
    };

    let nav = (element, options)=> {
        let defaults = element.data("setting") || {};
        let settings = $.extend(defaults, options);

        if (!element.data("init")) {
            //add class
            if (!element.hasClass("addon-nav")) {
                element.addClass("addon-nav");
            }

            // // build html
            // element.append(function () {
            //
            // });
            element.data({"init": true});
        }


        return element;
    }

}));
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
    $.fn.nav = function(options){
        return this.each(()=> {
            nav($(this), options);
        });
    };

    let nav = (element, options)=> {
        let settings = element.addonSettingExtend(options);

        element.addonInit("nav");

        //listen click
        element.children("div[key]").delegate("","click",function () {
           window.location.href= "../"+$(this).attr("key")+"/";
        });

        return element;
    }

}));
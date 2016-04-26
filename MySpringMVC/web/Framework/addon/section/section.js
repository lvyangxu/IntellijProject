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
    $.fn.section = function(options){
        return this.each(()=> {
            section($(this), options);
        });
    };

    let section = (element, options)=> {
        let defaults = element.data("setting") || {};
        let settings = $.extend(defaults, options);

        element.addonInit("section");

        element.children(".container").children("div").children("div").each(function (index) {
            if(index==0){
                $(this).addClass("active");
            }else {
                let sectionId = $(this).attr("section");
                $("#"+sectionId).hide();
            }
        });

        /**
         * menu click
         */
        element.children(".container").children("div").children("div").delegate("","click",function(){
            //change class
            element.children(".container").children("div").children("div").removeClass("active");
            $(this).addClass("active");

            //change section
            $(this).siblings("div").each(function(){
                let sectionId = $(this).attr("section");
                $("#"+sectionId).hide();
            });
            let sectionId = $(this).attr("section");
            $("#"+sectionId).show();
        });


        return element;
    }

}));
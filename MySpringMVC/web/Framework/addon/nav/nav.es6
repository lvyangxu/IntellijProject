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

        //init section
        element.children(".container").children("div").children("div").each(function (index) {
            if(index==0){
               $(this).addClass("active");
            }else {
                let sectionId = $(this).attr("section");
                $("#"+sectionId).hide();
            }
        });

        //set menu div responsive
        element.children(".container").children(".left").fit(()=> {
            let w = 0;
            element.children(".container").children(".left").children("div").each(function () {
                w += $(this).width();
            });
            let n = element.children(".container").children(".left").children("div").length;
            let space = (1000-w)/(n+1);
            element.children(".container").children(".left").children("div").css({
                "margin-left":space+"px"
            })

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
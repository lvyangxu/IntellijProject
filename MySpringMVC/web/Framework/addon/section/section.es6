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
    $.fn.section = function (options) {
        return this.each(()=> {
            section($(this), options);
        });
    };

    let section = (element, options)=> {

        let settings = element.addonSettingExtend(options);

        element.addonInit("section", ()=> {


            //append html
            element.append(function () {
                let menuHtml = "<div class='menu'>";
                let i=0;
                element.children("div[section]").each(function () {
                    menuHtml += "<div class='li' index='"+i+"'>" + $(this).attr("section") + "</div>";
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
                let sectionId = $(this).attr("section");
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
            let scrollTopArr = [];
            let scrollTop = 0;
            element.children("div[section]").each(function () {
                scrollTopArr.push(scrollTop);
                scrollTop += $(this).outerHeight();
            });
            let i = $(this).attr("index");
            $("html,body").animate({"scrollTop":scrollTopArr[i]}, 800);


        });


        return element;
    }

}));
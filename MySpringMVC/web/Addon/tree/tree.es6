/**
 * demo like below
 * <div class='tree'>
 *     <div key='xxx' title='xxx'>
 *          <div key="xxx">xxx</div>
 *          <div key="xxx">xxx</div>
 *     </div>
 *     <div key='xxx' title='xxx'>
 *     </div>
 * </div>
 * <div class='tree-panel'>
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

}(function ($) {
    'use strict';
    $.fn.tree = function (options) {
        return $(this).each(function(){
            tree($(this), options);
        });
    };

    let tree = (element, options)=> {
        let settings = element.addonSettingExtend(options, {
            width: element.property("width", 150)
        });

        element.addonInit("tree", function () {
            element.width(settings.width);
            let key = element.children("div").attr("key");
            let childKey = element.children("div").children("div").attr("key");
            key = key + "_" + childKey;
            element.next("div").children("div[tree-key=" + key + "]").show();

            element.append(()=> {
                let html = "";
                element.children("div[key]").each(function (i) {
                    let level1Name = $(this).attr("key");
                    let level1Title = $(this).attr("title");
                    let iClass = (i == 0) ? "fa-minus" : "fa-plus";
                    html += "<div class='level1' name='" + level1Name + "'><i class='fa " + iClass + "'></i>" + level1Title;
                    $(this).children("div[key]").each(function (j) {
                        let level2Name = $(this).attr("key");
                        let level2Title = $(this).text();
                        let activeHtml = (i == 0 && j == 0) ? " active" : "";
                        html += "<div class='level2" + activeHtml + "' name='" + level2Name + "'>" + level2Title + "</div>";
                    });
                    html += "</div>";
                })
                return html;
            });

            element.children(".level1").first().children(".level2").show();

            //listen level1 click
            element.children(".level1").delegate("", "click", function () {
                if($(this).children("i").hasClass("fa-plus")){
                    $(this).children("i").removeClass("fa-plus");
                    $(this).children("i").addClass("fa-minus");
                    $(this).children(".level2").slideDown();
                }else{
                    $(this).children("i").removeClass("fa-minus");
                    $(this).children("i").addClass("fa-plus");
                    $(this).children(".level2").slideUp();
                }
            });

            //listen level2 click
            element.xPath(".level1>.level2").delegate("","click",function (e) {
                e.stopPropagation();
                element.xPath(".level1>.level2").removeClass("active");
                let name = $(this).parent().attr("name");
                let childName = $(this).attr("name");
                name = name + "_" + childName;
                window.location.hash = "#"+name;
                $(this).addClass("active");
                $("div[tree-key]").hide();
                $("div[tree-key="+name+"]").show();
            })

            let hash = window.location.hash;
            let find = element.children(".level1").children(".level2").toArray().find(d=> {
                d = (("#" + d.parent().attr("name") +"_" + d.attr("name")) == hash);
                return d;
            });
            if (find != undefined) {
                let level1Name = find.parent().attr("name");
                let level2Name = find.attr("name");

                let thisLevel1 = element.children(".level1[name="+level1Name+"]");
                let thisLevel2 = element.children(".level1[name="+level1Name+"]").children(".level2[name="+level2Name+"]");
                let otherLevel1 = thisLevel1.siblings(".level1");
                let otherLevel1Level2 = otherLevel1.children(".level2");
                let thisLevel1OtherLevel2 =thisLevel1.children(".level2[name!="+level2Name+"]");
                
                //active
                otherLevel1Level2.removeClass("active");
                thisLevel1OtherLevel2.removeClass("active");
                thisLevel2.addClass("active");

                //i class
                otherLevel1.children("i").removeClass("fa-minus");
                otherLevel1.children("i").addClass("fa-plus");
                thisLevel1.children("i").removeClass("fa-plus");
                if(!thisLevel1.children("i").hasClass("fa-minus")){
                    thisLevel1.children("i").addClass("fa-minus");
                }

                //hide and show
                otherLevel1Level2.hide();
                thisLevel1.children(".level2").show();


                let name = level1Name+"_"+level2Name;
                element.next(".tree-panel").children("div[tree-key="+name+"]").siblings().hide();
                element.next(".tree-panel").children("div[tree-key="+name+"]").show();



            }

        });


        return element;
    }

}));
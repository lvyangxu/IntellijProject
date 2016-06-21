/**
 * select js
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
    "use strict";
    $.fn.select = function (options) {
        return this.each(function () {
            select($(this), options);
        });
    };

    let select = function (element, options) {

        let settings = element.addonSettingExtend(options, {
            "title": element.property("title", "select"),
            "data": [],
            "callback": ()=> {
            }
        });

        let node = {
            panel(){
                return element.children(".select-panel");
            },
            panelHeadCheckbox(){
                return element.xPath(".select-panel>.select-panel-head>input[type=checkbox]");
            },
            panelBodyCheckbox(){
                return element.xPath(".select-panel>.select-panel-body>.group>div>input[type=checkbox]");
            }
        }

        let func = {
            setData(){
                let checkedNum = settings.data.filter(d=> {
                    return d.checked;
                }).length;
                let numStr = checkedNum + "/" + settings.data.length;
                node.panel().xPath(".select-panel-head>.text").text(numStr);

                node.panel().children(".select-panel-body").html(()=>{
                    let panelHtml = "";
                    for (let i = 0; i <= settings.data.length / 10; i++) {
                        let end = (i * 10 + 10) < settings.data.length ? ((i * 10 + 10)) : settings.data.length;
                        let currentArr = settings.data.slice(i * 10, end);

                        panelHtml += "<div class='group'>";
                        panelHtml += currentArr.map(d=> {
                            let checkedHtml = d.checked ? " checked='checked'" : "";
                            d = "<div optionId='" + d.id + "'><input type='checkbox'" + checkedHtml + "><div class='text'>" + d.name + "</div></div>";
                            return d;
                        }).join("");
                        panelHtml += "</div>";
                    }
                    return panelHtml;
                });

                element.data("data", settings.data);
            }
        }

        element.addonInit("select", ()=> {

            // build html
            element.append(function () {
                let buttonHtml = "<button class='button-info'>" + settings.title + " <i class='fa fa-check-square-o'></i></button>";
                let panelHtml = "<div class='select-panel'>";
                let allChecked = settings.data.some(d=> {
                    return !d.checked;
                });
                let allCheckedHtml = allChecked ? "" : " checked='checked'";
                let checkedNum = settings.data.filter(d=> {
                    return d.checked;
                }).length;
                let numStr = checkedNum + "/" + settings.data.length;
                panelHtml += "<div class='select-panel-head'><input type='checkbox'" + allCheckedHtml + "><div class='text'>" + numStr + "</div></div>";
                panelHtml += "<div class='select-panel-body'>";
                for (let i = 0; i <= settings.data.length / 10; i++) {
                    let end = (i * 10 + 10) < settings.data.length ? ((i * 10 + 10)) : settings.data.length;
                    let currentArr = settings.data.slice(i * 10, end);

                    panelHtml += "<div class='group'>";
                    panelHtml += currentArr.map(d=> {
                        let checkedHtml = d.checked ? " checked='checked'" : "";
                        d = "<div optionId='" + d.id + "'><input type='checkbox'" + checkedHtml + "><div class='text'>" + d.name + "</div></div>";
                        return d;
                    }).join("");
                    panelHtml += "</div>";
                }

                panelHtml += "</div>";
                panelHtml += "</div>";
                return buttonHtml + panelHtml;
            });

            func.setData();

            element.children("button").delegate("", "click", function () {
                node.panel().toggle();
            });

            //listen checkbox
            node.panelHeadCheckbox().delegate("", "click", function () {
                settings.data = settings.data.map(d=> {
                    d.checked = $(this).prop("checked");
                    return d;
                })
                node.panelBodyCheckbox().prop("checked", $(this).prop("checked"));
                func.setData();
                settings.callback();
            });
            node.panelBodyCheckbox().delegate("", "click", function () {
                let optionId = $(this).parent().attr("optionId");
                settings.data = settings.data.map(d=> {
                    if (d.id == optionId) {
                        d.checked = $(this).prop("checked");
                    }
                    return d;
                });
                func.setData();
                settings.callback();
            });
        });

        if (options != undefined && options.data != undefined) {
            func.setData();
        }

        return element;
    }

}));

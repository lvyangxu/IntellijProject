/**
* scroll js
*/
(function($) {
	"use strict";
	$.fn.loadingAnimate = function(options) {
		return this.each(function() {
			doLoadingAnimate($(this),options);
		});
	};

	var doLoadingAnimate = function(element,options){

        switch (options.type) {
            case "left":
                var width = element.css("width");
                element.addClass("loadingAnimateLeft");

                break;
            default:
                break;

        }

		// init
		if(!element.data("init")){

			//add to element data
			element.data({"init":true});
		};

		if(options==undefined){
			return;
		}

		// set data
		if(options.data!=undefined){

		};

		return element;
	}

})(jQuery);

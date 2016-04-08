/**
* scroll js
*/
(function($) {
	"use strict";
	$.fn.fullScroll = function(options) {
		return this.each(function() {
			doFullScroll($(this),options);
		});
	};

	var doFullScroll = function(element,options){

        var setting = {
            fullScreen:true,
			height:$(window).height(),
			width:$(window).width(),
			currentIndex:0
        };

        element.data("setting",setting);

		// init
		if(!element.data("init")){
            //full screen
            element.children("div").css({
				"height":setting.height+"px",
                "width":setting.width+"px"
			});
			element.children("div").each(function(index){
				$(this).attr("index",index);
			});
			element.children("div").first().show();

			$.extend(setting,{"length":element.children("div").length});
            element.data("setting",setting);

            var lastY;
			element.delegate("","mousewheel",function(e){
                var currentY = $(window).scrollTop();
                if(currentY==lastY){
					return;
				}

                var direction;
				if(lastY==undefined){
                    if(currentY==0){
						lastY = 0;
						return;
					}else{
						direction="down";
					}
				}else{
					if(currentY>lastY){
	                    direction="down";
	                }else if(currentY<lastY){
	                    direction="up";
	                }else{
						direction="";
					}
				}
                lastY = $(window).scrollTop();
				$.extend(setting,element.data("setting"));

				if(direction=="down"){
					if(setting.currentIndex+1<setting.length){
						element.children("div[index="+setting.currentIndex+"]").removeClass("open");
						element.children("div[index="+setting.currentIndex+"]").addClass("close");
						element.children("div[index="+(setting.currentIndex+1)+"]").removeClass("close");
						element.children("div[index="+(setting.currentIndex+1)+"]").addClass("open");
						var newSetting = {"currentIndex":(setting.currentIndex+1)};
						var oldSetting = element.data("setting");
						$.extend(oldSetting,newSetting);
						element.data("setting",oldSetting);
						console.log("down");
					}

				};
				if(direction=="up"){
					if(setting.currentIndex>0){
						element.children("div[index="+setting.currentIndex+"]").removeClass("open");
                        element.children("div[index="+setting.currentIndex+"]").addClass("close");
						element.children("div[index="+(setting.currentIndex-1)+"]").removeClass("close");
						element.children("div[index="+(setting.currentIndex-1)+"]").addClass("open");
						var newSetting = {"currentIndex":(setting.currentIndex-1)};
						var oldSetting = element.data("setting");
						$.extend(oldSetting,newSetting);
						element.data("setting",oldSetting);
						console.log("up");
					}
				}
            });

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

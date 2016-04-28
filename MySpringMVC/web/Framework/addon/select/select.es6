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
	$.fn.select = function(options) {
		return this.each(function() {
			doSelect($(this),options);
		});
	};

	var doSelect = function(element,options){
		//get element attr
		var attr = function(name,defaultValue){
			var result = element.attr(name);
			if(defaultValue!=undefined&&result==undefined){
				result = defaultValue;
			}
			return result;
		}

		//get element children element
		var node = function(name){
			var result;
			switch (name) {
			case "contain":
				result = element.children(".contain");
				break;
			case "panel":
				result = element.children(".contain").children(".panel");
				break;
			case "head":
				result = element.children(".contain").children(".panel").children(".head");
				break;
			case "label":
				result = element.children(".contain").children(".panel").children(".head").children("label");
				break;
			case "body":
				result = element.children(".contain").children(".panel").children(".body");
				break;
			}
			return result;
		}		
				
		//get or set element data
		var data = function(name,value){
			var result;
			if(value==undefined){
				result = element.data(name);
			}else{
				element.data(name,value);
				result = element.data(name);
			}
			return result;
		}
		
		var title = attr("title","multi-select");
		

		// init
		if(!element.data("init")){
			(function() {
				// build html
				element.append(function() {
					var headHtml = "<div class='head'><input type='checkbox'><label>已选中0项</label></div>";
					var bodyHtml = "<div class='body'></div>";
					var innerHtml = "<div class='contain'>"
					+ "<button class='switch btn btn-info'>"+title+"<i class='fa fa-check-square-o'></i></button>"
					+ "<div class='panel'>"
					+ headHtml + bodyHtml + "</div>" + "</div>";
					return innerHtml;
				});

				//prevent click event bubbling
				element.delegate(".contain","click",function(event){
					event.stopPropagation();
				});
			})();

			//listen head checkbox
			node("head").delegate("input[type=checkbox]","click",function(){
				if(data("data")==undefined){
					return;
				}
				
				var checkbox = node("head").children("input[type=checkbox]");
				if(checkbox.prop("checked")){
				    var d1 = data("data").map(function(d){
				    	d.checked = true;
				    	return d;
				    });
				    data("data",d1);		
					node("label").html("已选中"+data("data").length+"项");	
					node("body").children("div").children("input").prop("checked",true);
				}else{
			    	var d1 = data("data").map(function(d){
			    		d.checked = false;
			    		return d;
			    	});
				    data("data",d1);
					node("label").html("已选中0项");	
					node("body").children("div").children("input").prop("checked",false);
				}
								
				if(options!=undefined&&options.selectCallback!=undefined){
					var callback = options.selectCallback;
					callback();
				}
			});

			// delegate toggle panel
			node("contain").delegate("button", "click", function() {
				if($(this).hasClass("switch")){
					node("panel").toggle();
				}else{
					node("panel").show();
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
		    data("data",options.data);
			var bodyHtml = data("data").map(function(d){
				var checkedHtml = "";
				if(d.checked){
					checkedHtml = "checked='checked'";
				}
				var result = "<div><input type='checkbox' "+checkedHtml+">"+(d.name==undefined?"":d.name)+"</div>";
				return result;
			}).collect("join","");
			node("body").html(bodyHtml);
			var n = data("data").filter(function(row){
				return row.checked;
			}).length;
			node("label").html("已选中"+n+"项");
			
			//listen checkbox
			node("body").children("div").delegate("input[type=checkbox]","click",function(){
				var currentData = [];
				node("body").children("div").children("input").each(function(){
					currentData.push({"name":$(this).parent().text(),"checked":$(this).prop("checked")});
				});
				data("data",currentData);
				var n = data("data").filter(function(row){
					return row.checked;
				}).length;
				node("label").html("已选中"+n+"项");			
				if(options.selectCallback!=undefined){
					var callback = options.selectCallback;
					callback();
				}
			});     
		};



		return element;
	}

}));

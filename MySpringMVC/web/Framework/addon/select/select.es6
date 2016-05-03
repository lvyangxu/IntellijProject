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
			select($(this),options);
		});
	};

	let select = function(element,options){

		let settings = element.addonSettingExtend(options);

		let contain = element.xPath(".contain");
		let panel = element.xPath(".contain>.panel");
		let head = element.xPath(".contain>.panel>.head");
		let label = element.xPath(".contain>.panel>.head>label");
		let body = element.xPath(".contain>.panel>.body");

		element.addonInit("section", ()=> {

			//init setting
			let defaultSetting = {
				"title": element.property("title","multi-select")
			};
			settings = $.extend(defaultSetting, settings);

			// build html
			element.append(function() {
				var headHtml = "<div class='head'><input type='checkbox'><label>已选中0项</label></div>";
				var bodyHtml = "<div class='body'></div>";
				var innerHtml = "<div class='contain'>"
					+ "<button class='switch btn btn-info'>"+settings.title+"<i class='fa fa-check-square-o'></i></button>"
					+ "<div class='panel'>"
					+ headHtml + bodyHtml + "</div>" + "</div>";
				return innerHtml;
			});

			//prevent click event bubbling
			element.delegate(".contain","click",function(event){
				event.stopPropagation();
			});

			//listen head checkbox
			head.delegate("input[type=checkbox]","click",function(){
				if(data("data")==undefined){
					return;
				}

				let checkbox = head.children("input[type=checkbox]");
				if(checkbox.prop("checked")){
					var d1 = data("data").map(function(d){
						d.checked = true;
						return d;
					});
					data("data",d1);
					label.html("已选中"+data("data").length+"项");
					body.children("div").children("input").prop("checked",true);
				}else{
					var d1 = data("data").map(function(d){
						d.checked = false;
						return d;
					});
					data("data",d1);
					label.html("已选中0项");
					body.children("div").children("input").prop("checked",false);
				}

				if(options!=undefined&&options.selectCallback!=undefined){
					var callback = options.selectCallback;
					callback();
				}
			});

			// delegate toggle panel
			contain.delegate("button", "click", function() {
				if($(this).hasClass("switch")){
					panel.toggle();
				}else{
					panel.show();
				}
			});
		});

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
			body.html(bodyHtml);
			var n = data("data").filter(function(row){
				return row.checked;
			}).length;
			label.html("已选中"+n+"项");
			
			//listen checkbox
			body.children("div").delegate("input[type=checkbox]","click",function(){
				var currentData = [];
				body.children("div").children("input").each(function(){
					currentData.push({"name":$(this).parent().text(),"checked":$(this).prop("checked")});
				});
				data("data",currentData);
				var n = data("data").filter(function(row){
					return row.checked;
				}).length;
				label.html("已选中"+n+"项");
				if(options.selectCallback!=undefined){
					var callback = options.selectCallback;
					callback();
				}
			});     
		};



		return element;
	}

}));

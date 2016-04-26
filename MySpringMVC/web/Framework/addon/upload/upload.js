/**
* upload js
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
	$.fn.upload = function(options) {
		return this.each(function() {
			doUpload($(this),options);
		});
	};

	var doUpload = function(element,options){
		var title = (element.attr("title")==undefined)?"":element.attr("title");
		var url = element.attr("url");
		var postData = (element.attr("postData")==undefined)?"":("?"+element.attr("postData"));
		element.data("postData",postData);
		
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
			case "body":
				result = element.children(".contain").children(".panel").children(".body");
				break;
			case "tbody":
				result = element.children(".contain").children(".panel").children(".body").children("table").children("tbody");
				break;
			}
			return result;
		}				
		
		// init
		if(!element.data("init")){
			(function() {
				// build html
				element.append(function() {
					var innerHtml = "<div class='contain'>"
					+ "<button class='switch btn btn-info'><i class='fa fa-upload'></i>"+title+"</button>"
					+ "<div class='panel'>"
					+ "<div class='head'>"
					+ "<button class='add btn btn-info'><i class='fa fa-plus'></i>add new row</button>"
					+ "<button class='submit btn btn-warning'>submit</button>"
					+"</div>"
					+ "<div class='body'>"
					+"<table class='table table-bordered table-condensed table-hover'>"
					+"<thead><tr><th>file</th><th>name</th><th>size</th><th>status</th><th>remove</th></tr></thead>"
					+"<tbody></tbody></table>"
					+"</div>"
					+"</div>"
					+ "</div>";
					return innerHtml;
				});
				var contain = element.children(".contain");

				//prevent click event bubbling
				element.delegate(".contain","click",function(event){
					event.stopPropagation();
				});
			})();
			
			// delegate toggle panel
			var contain = element.children(".contain");
			var panel = contain.children(".panel");
			var togglePanel = function() {
				if (element.data("openCallback") != undefined) {
					var isReady = element.data("openCallback")();
					if (!isReady) {
						return;
					}
				}				
				panel.toggle();
				if (element.data("hideCallback") != undefined) {
					if(panel.is(":hidden")){
						element.data("hideCallback")();
					}					
				}
			}			
			contain.children(".switch").delegate("", "click", function() {			
                if(element.data("beforeOpenCallback")!=undefined){
                	element.data("beforeOpenCallback")(function(){
                		togglePanel();
                	});
                }else{
                	togglePanel();
                }

			});
			
			//add new row
			node("head").children(".add").delegate("","click",function(){
				var trHtml = "<tr>";
				trHtml += "<td class='select'><button class='btn btn-xs btn-success'>choose file</button><input type='file'></td>";
				trHtml += "<td class='name'></td>";
				trHtml += "<td class='size'></td>";
				trHtml += "<td class='status'><label></label><div class='progress progress-striped active'>";
				trHtml += "<div class='progress-bar progress-bar-success' role='progressbar' aria-valuemin='0' aria-valuemax='100'>";
				trHtml += "</div></div></td>";
				trHtml += "<td><button class='remove btn btn-xs btn-danger'><i class='fa fa-times'></i></button></td></tr>";
				node("tbody").append(trHtml);
				node("tbody").children("tr:last").children(".select").children("button").delegate("","click",function(){
					$(this).parent().children("input[type=file]").click();
				});
				node("tbody").children("tr:last").children(".select").children("input[type=file]").delegate("","change",function(){
					var file = this.files[0];
					if(file==undefined){
						$(this).parent().parent().children(".name").text("");
						$(this).parent().parent().children(".size").text("");
						return;
					}				
					$(this).parent().parent().children(".name").text(file.name);
					var size = file.size;
				    if (size > 1024 * 1024) {
				    	size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
				    }
				    else {
				    	size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
				    }
				    $(this).parent().parent().children(".size").text(size);
				});
				node("tbody").children("tr:last").children("td").children(".remove").delegate("","click",function(event){
					$(this).parent().parent().remove();
					event.stopPropagation();
				});
				
			});
			
			//submit
			node("head").children(".submit").delegate("","click",function(){
				var n = node("tbody").children("tr").length;
				if(n==0){
				    alert("请至少添加一个附件");
				    return;
				}				
				if(confirm("确定上传这"+n+"个文件吗？")){
					//check if select files
					var isValid = true;
					node("tbody").children("tr").each(function(){
						if($(this).children(".select").children("input[type=file]")[0].files.length==0){							
							isValid = false;
						}
					})
					if(!isValid){
						alert("请确保表格每行都存在附件");
						return;
					}
					
					node("tbody").children("tr").each(function(){
						var uploadFile = new FormData();
						uploadFile.append(0,$(this).children(".select").children("input[type=file]")[0].files[0]);
						$(this).children(".status").children(".progress").show();
						$(this).children(".status").children("label").hide();
						var status = $(this).children(".status");
	                    var xhr = new XMLHttpRequest();
	                    xhr.upload.addEventListener("progress", function(evt){
	                        if (evt.lengthComputable) {
	                            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	                            status.children(".progress").children(".progress-bar").css({"width":percentComplete+"%"});
	                        }
	                    }, false);
	                    xhr.addEventListener("load", function(evt){
	                    	var result = evt.target.responseText;
	                    	var jsonObject;
	            			try{
	            				jsonObject = result.toJson();
	            			}catch(e){
	                        	status.children(".progress").hide();
	                        	status.children("label").show();
	                        	status.children("label").text("Server Internal Error");
	                        	status.children("label").css({"color":"rgba(203,61,57,1)"});
	                        	return;
	            			}	
	                        if (jsonObject.success == "true") {
	                        	status.children(".progress").hide();
	                        	status.children("label").show();
	                        	status.children("label").text("Success");
	                        	status.children("label").css({"color":"rgba(75,185,218,1)"});
	                        } else {
	                        	status.children(".progress").hide();
	                        	status.children("label").show();
	                        	status.children("label").text("Server Internal Error:"+jsonObject.message);
	                        	status.children("label").css({"color":"rgba(203,61,57,1)"});
	                        }	                    	
	                    }, false);
	                    xhr.addEventListener("error", function(){
	                    	status.children(".progress").hide();
	                    	status.children("label").show();
	                    	status.children("label").text("Client Error");
	                    	status.children("label").css({"color":"rgba(203,61,57,1)"});                    	
	                    }, false);
	                    xhr.addEventListener("abort", function(){
	                    	status.children(".progress").hide();
	                    	status.children("label").show();
	                    	status.children("label").text("Cancelled");
	                    	status.children("label").css({"color":"rgba(203,61,57,1)"});
	                    }, false);
	                    xhr.open("POST", url+element.data("postData"));
	                    xhr.send(uploadFile);						
					});

				}
			});

			//add to element data
			element.data({"init":true});
		};

		if(options==undefined){
			return;
		}

		var panel = element.children(".contain").children(".panel");

		// set data
		if(options.data!=undefined){
			var data = options.data;
			var bodyHtml = data;
			panel.html(bodyHtml);
		};
		
		if(options.openCallback!=undefined){
			element.data("openCallback",options.openCallback);
		}
		
		if(options.beforeOpenCallback!=undefined){
			element.data("beforeOpenCallback",options.beforeOpenCallback);
		}
		
		if(options.hideCallback!=undefined){
			element.data("hideCallback",options.hideCallback);
		}

		return element;
	}

}));

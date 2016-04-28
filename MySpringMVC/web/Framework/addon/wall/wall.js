'use strict';

/**
* wall js
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
})(function ($) {
	"use strict";

	$.fn.wall = function (options) {
		return this.each(function () {
			doWall($(this), options);
		});
	};

	var doWall = function doWall(element, options) {
		var title = element.attr("title") == undefined ? "" : element.attr("title");
		var icon = element.attr("icon") == undefined ? "check-square-o" : element.attr("icon");
		var buttonClass = element.attr("button-class") == undefined ? "info" : element.attr("button-class");
		var iconOnly = element.attr("iconOnly") != undefined;

		// init
		if (!element.data("init")) {
			(function () {
				// build html
				element.append(function () {
					var innerHtml = "<div class='contain'>";
					innerHtml += iconOnly ? "<i class='switch fa fa-" + icon + "'></i>" : "<button class='switch btn btn-" + buttonClass + "'>" + title + "<i class='fa fa-" + icon + "'></i></button>";
					innerHtml += "<div class='panel'></div>";
					innerHtml += "</div>";
					return innerHtml;
				});
				var contain = element.children(".contain");

				//prevent click event bubbling
				element.delegate(".contain", "click", function (event) {
					event.stopPropagation();
				});
			})();

			// delegate toggle panel
			var contain = element.children(".contain");
			var panel = contain.children(".panel");
			var togglePanel = function togglePanel() {
				if (element.data("openCallback") != undefined) {
					var isReady = element.data("openCallback")();
					if (!isReady) {
						return;
					}
				}
				panel.toggle();
			};
			contain.children(".switch").delegate("", "click", function () {
				if (element.data("beforeOpenCallback") != undefined) {
					element.data("beforeOpenCallback")(function () {
						togglePanel();
					});
				} else {
					togglePanel();
				}
			});

			//add to element data
			element.data({ "init": true });
		};

		if (options == undefined) {
			return;
		}

		var panel = element.children(".contain").children(".panel");

		// set data
		if (options.data != undefined) {
			var data = options.data;
			var bodyHtml = data;
			panel.html(bodyHtml);
		};

		if (options.html != undefined) {
			panel.html(options.html);
		};

		if (options.openCallback != undefined) {
			element.data("openCallback", options.openCallback);
		}

		if (options.beforeOpenCallback != undefined) {
			element.data("beforeOpenCallback", options.beforeOpenCallback);
		}

		return element;
	};
});

//# sourceMappingURL=wall.js.map
'use strict';

/**
* datepicker js
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

	$.fn.datepicker = function (options) {
		return this.each(function () {
			doDatepicker($(this), options);
		});
	};

	var doDatepicker = function doDatepicker(element, options) {
		var type = element.attr("type");
		var addNum = element.attr("add-num");
		var initValue = element.attr("value");
		var minYear = 2000;
		var currentPanel = "";
		var currentPanelYear = 2000;
		var currentPanelMonth = 1;

		//init
		if (!element.data("init")) {

			//build html
			element.append(function () {
				var headHtml = "<div class='head'><label>datepicker</label>" + "<button class='previous'><i class='fa fa-chevron-up'></i></button>" + "<button class='next'><i class='fa fa-chevron-down'></i></button>" + "</div>";
				var bodyHtml = "<div class='body'></div>";
				var innerHtml = "<div class='contain'>" + "<input class='form-control'><button class='switch btn btn-info'><i class='fa fa-calendar'></i></button>" + "<div class='panel'>" + headHtml + bodyHtml + "</div>" + "</div>";
				return innerHtml;
			});

			var contain = element.children(".contain");
			var input = contain.children("input");
			var panel = contain.children(".panel");
			var head = panel.children(".head");
			var body = panel.children(".body");
			var foot = panel.children(".foot");

			var setValueByAddnum = function setValueByAddnum() {
				addNum = addNum == undefined ? 0 : addNum;
				var str = "";
				switch (type) {
					case "month":
						str = date.getLocalDay(0).substr(0, 7);
						str = date.addMonth(str, addNum);
						break;
					case "day":
						str = date.getLocalDay(parseInt(addNum));
						break;
					case "week":
						str = date.getLocalDay(parseInt(addNum));
						str = date.toMonday(str);
						break;
				}
				element.data("data", str);
				input.val(str);
			};

			//default value
			if (initValue != undefined) {
				var arr = initValue.split("-");
				try {
					var cy = parseInt(arr[0]);
					var cm = parseInt(arr[1]);
					var cd = parseInt(arr[2]);
					var d = new Date(arr[0], parseInt(arr[1]) - 1, 1);
					if (cy < 2000 || cy >= 10000 || cm < 1 || cm > 12 || cd < 1 || cd > parseInt(getDaysOfMonth(d))) {
						setValueByAddnum();
					} else {
						switch (type) {
							case "week":
								element.data("data", toMonday(initValue));
								break;
							default:
								element.data("data", initValue);
								break;
						}
						input.val(element.data("data"));
					}
				} catch (e) {
					setValueByAddnum();
				}
			} else {
				setValueByAddnum();
			}

			// switch to year panel
			var switchToYear = function switchToYear(y) {
				//set display year
				head.children("label").html(y + "年");

				//set year panel
				var yearPanelHtml = "";
				var m = y % 4;
				for (var i = y - m; i <= y - m + 15; i = i + 4) {
					yearPanelHtml = yearPanelHtml + "<div class='yearLine'>";
					for (var j = i; j <= i + 3; j++) {
						var activeHtml = "";
						if (j == y) {
							activeHtml = "class='active'";
						}
						yearPanelHtml = yearPanelHtml + "<button " + activeHtml + ">" + j + "</button>";
					}
					yearPanelHtml = yearPanelHtml + "</div>";
				}
				body.html(yearPanelHtml);
				currentPanel = "year";
				currentPanelYear = y;
			};

			//switch to month panel
			var switchToMonth = function switchToMonth(y) {
				//set display year
				head.children("label").html(y + "年");

				//switch to month panel
				var monthPanelHtml = "";
				for (var i = 1; i <= 16; i = i + 4) {
					monthPanelHtml = monthPanelHtml + "<div class='monthLine'>";
					for (var j = i; j <= i + 3; j++) {
						var inputYear = "";
						var inputMonth = "";
						if (element.data("data") != undefined) {
							var arr = element.data("data").split("-");
							inputYear = parseInt(arr[0]);
							inputMonth = parseInt(arr[1]);
						}
						var activeHtml = "";
						if (y == inputYear && j == inputMonth) {
							activeHtml = " active";
						}
						if (j <= 12) {
							var displayMonth = j;
							monthPanelHtml += "<button class='month" + activeHtml + "'>" + displayMonth + "月</button>";
						} else {
							var displayMonth = j - 12;
							monthPanelHtml += "<button class='month darker'>" + displayMonth + "月</button>";
							currentPanelYear += +1;
						}
					}
					monthPanelHtml = monthPanelHtml + "</div>";
				}
				body.html(monthPanelHtml);
				currentPanel = "month";
				currentPanelYear = y;
			};

			var switchToDay = function switchToDay(y, m) {
				//set display year
				head.children("label").html(y + "年" + m + "月");

				var dayPanelHtml = "";

				//the first day of dayOfWeek,from monday to sunday,1 to 7
				var d = new Date(parseInt(y), parseInt(m) - 1, 1);
				var dayOfWeek = d.getDay();
				if (dayOfWeek == 0) {
					dayOfWeek = 7;
				}

				//last month days
				var lastMonthD = new Date();
				if (d.getMonth() == 0) {
					lastMonthD = new Date(parseInt(y) - 1, 11, 1);
				} else {
					lastMonthD = new Date(parseInt(y), parseInt(m) - 2, 1);
				}
				var daysOfLastMonth = getDaysOfMonth(lastMonthD);

				//name line
				if (type == "day") {
					dayPanelHtml = dayPanelHtml + "<div class='dayNameLine'>";
				} else {
					dayPanelHtml = dayPanelHtml + "<div class='weekNameLine'>";
				}
				dayPanelHtml = dayPanelHtml + "<button disabled='disabled'>一</button>";
				dayPanelHtml = dayPanelHtml + "<button disabled='disabled'>二</button>";
				dayPanelHtml = dayPanelHtml + "<button disabled='disabled'>三</button>";
				dayPanelHtml = dayPanelHtml + "<button disabled='disabled'>四</button>";
				dayPanelHtml = dayPanelHtml + "<button disabled='disabled'>五</button>";
				dayPanelHtml = dayPanelHtml + "<button disabled='disabled'>六</button>";
				dayPanelHtml = dayPanelHtml + "<button disabled='disabled'>日</button>";
				dayPanelHtml = dayPanelHtml + "</div>";

				//last month button
				if (type == "day") {
					dayPanelHtml = dayPanelHtml + "<div class='dayLine'>";
				} else {
					dayPanelHtml = dayPanelHtml + "<div class='weekLine'>";
				}
				if (dayOfWeek != 1) {
					for (var i = 1; i < dayOfWeek; i++) {
						var day = daysOfLastMonth - dayOfWeek + 1 + i;
						dayPanelHtml = dayPanelHtml + "<button class='day darker'>" + day + "</button>";
					}
				}

				//active day
				var inputYear = "";
				var inputMonth = "";
				var inputDay = "";
				if (element.data("data") != undefined) {
					var arr = element.data("data").split("-");
					inputYear = parseInt(arr[0]);
					inputMonth = parseInt(arr[1]);
					inputDay = parseInt(arr[2]);
				}

				//fixed first line
				var j = 1;
				for (var i = 1; i <= 7 - dayOfWeek + 1; i++) {
					var activeHtml = "class='day'";
					if (inputYear == y && inputMonth == m && i == inputDay) {
						activeHtml = "class='day active'";
					}
					dayPanelHtml = dayPanelHtml + "<button " + activeHtml + ">" + i + "</button>";
					j++;
				}
				dayPanelHtml = dayPanelHtml + "</div>";

				//fixed other line
				var daysOfThisMonth = getDaysOfMonth(d);
				var preDays = dayOfWeek - 1;
				for (var i = j; i < j + 35; i = i + 7) {
					if (type == "day") {
						dayPanelHtml = dayPanelHtml + "<div class='dayLine'>";
					} else {
						dayPanelHtml = dayPanelHtml + "<div class='weekLine'>";
					}
					for (var k = i; k < i + 7; k++) {
						var activeHtml = "";
						if (inputYear == y && inputMonth == m && k == inputDay) {
							activeHtml = " active";
						}
						if (k > daysOfThisMonth) {
							dayPanelHtml = dayPanelHtml + "<button class='day" + activeHtml + " darker'>" + parseInt(k - daysOfThisMonth) + "</button>";
						} else {
							dayPanelHtml = dayPanelHtml + "<button class='day" + activeHtml + "'>" + k + "</button>";
						}
					}
					dayPanelHtml = dayPanelHtml + "</div>";
				}

				body.html(dayPanelHtml);
				currentPanel = "day";
				currentPanelYear = y;
				currentPanelMonth = m;
			};

			//delegate year button
			var delegateYear = function delegateYear(y) {
				y = parseInt(y);
				//delegate year click event
				body.children("div").delegate("button", "click", function (event) {
					var y = this.innerText;
					switchToMonth(y);
					delegateMonth(y);
					event.stopPropagation();
				});
			};

			//delegate month button
			var delegateMonth = function delegateMonth(y) {
				y = parseInt(y);
				//delegate month click event
				body.children("div").delegate("button", "click", function (event) {
					var m = parseInt(this.innerText);
					switch (type) {
						case "month":
							if (this.className.indexOf("dark") != -1) {
								y = y + 1;
							}
							var value = y + "-" + (m >= 10 ? m : "0" + m);
							element.data("data", value);
							input.val(value);
							break;
						case "day":
						case "week":
							switchToDay(y, m);
							delegateDay(y, m);
							break;

					}
					if (type != "month") {
						event.stopPropagation();
					}
				});
			};

			//delegate day button
			var delegateDay = function delegateDay(y, m) {
				y = parseInt(y);
				m = parseInt(m);
				//delegate day click event
				body.children("div").delegate("button", "click", function (event) {
					var d = parseInt(this.innerText);
					if (this.className.indexOf("dark") != -1) {
						if (d > 20) {
							if (m == 1) {
								y = y - 1;
								m = 12;
							} else {
								m = m - 1;
							}
						} else {
							if (m == 12) {
								y = y + 1;
								m = 1;
							} else {
								m = m + 1;
							}
						}
					}
					var value = y + "-" + (m >= 10 ? m : "0" + m) + "-" + (d >= 10 ? d : "0" + d);
					if (type == "week") {
						value = toMonday(value);
					}
					element.data("data", value);
					input.val(value);
				});
			};

			//delegate toggle panel
			contain.delegate("button", "click", function () {
				if ($(this).hasClass("switch")) {
					panel.toggle();
					//get year and set year panel
					var year = minYear;
					if (element.data("data") == "") {
						//get current time
						var d = new Date();
						var year = d.getFullYear();
						if (year < minYear) {
							year = minYear;
						}
					} else {
						//get input time
						var arr = element.data("data").split("-");
						year = arr[0];
					}
					switchToYear(year);
					delegateYear(year);
				} else {
					switch (type) {
						case "month":
							if ($(this).hasClass("month")) {
								panel.hide();
							} else {
								panel.show();
							}
							break;
						case "day":
						case "week":
							if ($(this).hasClass("day")) {
								panel.hide();
							} else {
								panel.show();
							}
							break;
					}
				}
			});

			//back to parent panel
			head.delegate("label", "click", function (event) {
				switch (currentPanel) {
					case "month":
						switchToYear(currentPanelYear);
						delegateYear(currentPanelYear);
						break;
					case "day":
						switchToMonth(currentPanelYear);
						delegateMonth(currentPanelYear);
						break;
				}
			});

			//previous
			contain.delegate(".previous", "click", function () {
				currentPanelYear = parseInt(currentPanelYear);
				currentPanelMonth = parseInt(currentPanelMonth);
				switch (currentPanel) {
					case "year":
						if (currentPanelYear - 16 >= minYear) {
							switchToYear(currentPanelYear - 16);
							delegateYear(currentPanelYear);
						} else {
							switchToYear(minYear);
							delegateYear(minYear);
						}
						break;
					case "month":
						if (currentPanelYear - 1 >= minYear) {
							switchToMonth(currentPanelYear - 1);
							delegateMonth(currentPanelYear);
						} else {
							switchToMonth(minYear);
							delegateMonth(minYear);
						}
						break;
					case "day":
						if (currentPanelMonth > 1) {
							switchToDay(currentPanelYear, currentPanelMonth - 1);
							delegateDay(currentPanelYear, currentPanelMonth);
						} else {
							if (currentPanelYear - 1 >= minYear) {
								switchToDay(currentPanelYear - 1, 12);
								delegateDay(currentPanelYear, 12);
							}
						}
						break;
				}
			});

			//next
			contain.delegate(".next", "click", function () {
				currentPanelYear = parseInt(currentPanelYear);
				switch (currentPanel) {
					case "year":
						switchToYear(currentPanelYear + 16);
						delegateYear(currentPanelYear);
						break;
					case "month":
						switchToMonth(currentPanelYear + 1);
						delegateMonth(currentPanelYear);
						break;
					case "day":
						if (currentPanelMonth < 12) {
							switchToDay(currentPanelYear, currentPanelMonth + 1);
							delegateDay(currentPanelYear, currentPanelMonth);
						} else {
							switchToDay(currentPanelYear + 1, 1);
							delegateDay(currentPanelYear, 1);
						}
						break;
				}
			});

			contain.delegate("input", "focus", function (event) {
				element.data({ "lastData": element.data("data") });
			});
			contain.delegate("input", "blur", function (event) {
				var arr = input.val().split("-");
				try {
					var cy = parseInt(arr[0]);
					var cm = parseInt(arr[1]);
					var cd = parseInt(arr[2]);
					var d = new Date(arr[0], parseInt(arr[1]) - 1, 1);
					if (cy < 2000 || cy >= 10000 || cm < 1 || cm > 12 || cd < 1 || cd > parseInt(getDaysOfMonth(d))) {
						input.val(element.data("lastData"));
						element.data("data", element.data("lastData"));
					} else {
						switch (type) {
							case "week":
								element.data("data", toMonday(input.val()));
								break;
							default:
								element.data("data", input.val());
								break;
						}
					}
				} catch (e) {
					input.val(element.data("lastData"));
					element.data("data", element.data("lastData"));
				}
			});

			//prevent click event bubbling
			element.delegate(".contain", "click", function (event) {
				event.stopPropagation();
			});

			//add to element data
			element.data({ "init": true });
		}
	};
});

//# sourceMappingURL=datepicker.js.map
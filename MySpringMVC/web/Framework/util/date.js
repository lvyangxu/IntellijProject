"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by karl on 2016/4/22.
 */

var date = function () {
    function date() {
        _classCallCheck(this, date);
    }

    _createClass(date, null, [{
        key: "getLocalDay",


        /**
         * get current local day
         * @param addDays
         * @returns {string|*} 
         */
        value: function getLocalDay(addDays) {
            var d = new Date();
            d.setDate(d.getDate() + addDays);
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var day = d.getDate();

            Array.from([month, day], function (d) {
                d = d < 10 ? "0" + d : d;
                return d;
            });
            var result = year + "-" + month + "-" + day;
            return result;
        }

        /**
         * get current local time
         * @param addDays
         * @returns {string|*}
         */

    }, {
        key: "getLocalTime",
        value: function getLocalTime(addDays) {
            var d = new Date();
            d.setDate(d.getDate() + addDays);
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var hour = d.getHours();
            var minute = d.getMinutes();
            var second = d.getSeconds();

            Array.from([month, day, hour, minute, second], function (d) {
                d = d < 10 ? "0" + d : d;
                return d;
            });
            var result = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
            return result;
        }

        /**
         * get days of the date's month have
         * @param d js date object
         * @returns {number}
         */

    }, {
        key: "getDaysOfMonth",
        value: function getDaysOfMonth(d) {
            var result = 0;
            var month = d.getMonth() + 1;
            switch (month) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    result = 31;
                    break;
                case 2:
                    //判断是否是闰年
                    var year = d.getFullYear();
                    if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
                        result = 29;
                    } else {
                        result = 28;
                    }
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    result = 30;
                    break;
            }
            return result;
        }

        /**
         * convert a date string to monday string in the same week
         * @param dateStr
         * @returns {string}
         */

    }, {
        key: "toMonday",
        value: function toMonday(dateStr) {
            var arr = dateStr.split("-");
            var d = new Date(arr[0], Number.parseInt(arr[1]) - 1, arr[2]);
            var dayOfWeek = d.getDay();
            if (dayOfWeek == 0) {
                dayOfWeek = 7;
            }
            var mondayNum = d.getDate() - dayOfWeek + 1;
            d.setDate(mondayNum);
            var year = d.getFullYear();
            var month = Number.parseInt(d.getMonth()) + 1;
            var day = d.getDate();

            Array.from([month, day], function (d1) {
                return d1 < 10 ? "0" + d1 : d1;
            });
            return year + "-" + month + "-" + day;
        }

        /**
         * convert yyyy-MM to it's last month string
         * @param dateStr
         * @returns {string}
         */

    }, {
        key: "toLastMonth",
        value: function toLastMonth(dateStr) {
            var _dateStr$split = dateStr.split("-");

            var _dateStr$split2 = _slicedToArray(_dateStr$split, 2);

            var year = _dateStr$split2[0];
            var month = _dateStr$split2[1];

            Array.from([year, month], function (d) {
                return Number.parseInt(d);
            });
            if (month == 1) {
                year = year - 1;
                return year + "-12";
            } else {
                return year + "-" + Number.parseInt(month - 1);
            }
        }

        /**
         * convert yyyy-MM to it's addNum month string
         * @param dateStr
         * @param addNum
         * @returns {string}
         */

    }, {
        key: "addMonth",
        value: function addMonth(dateStr, addNum) {
            var _dateStr$split3 = dateStr.split("-");

            var _dateStr$split4 = _slicedToArray(_dateStr$split3, 2);

            var year = _dateStr$split4[0];
            var month = _dateStr$split4[1];

            Array.from([year, month], function (d) {
                return Number.parseInt(d);
            });
            var yNum = parseInt(addNum / 12);
            var mNum = addNum % 12;
            if (mNum >= 0) {
                if (month + mNum <= 12) {
                    year += yNum;
                    month += mNum;
                } else {
                    year += yNum + 1;
                    month += mNum - 12;
                }
            } else {
                if (month + mNum > 0) {
                    year += +yNum;
                    month += mNum;
                } else {
                    year += +yNum - 1;
                    month += mNum + 12;
                }
            }
            month = month < 10 ? "0" + month : month;
            return year + "-" + month;
        }

        /**
         * get the later dateStr
         * @param dateStr1
         * @param dateStr2
         * @returns {*}
         */

    }, {
        key: "later",
        value: function later(dateStr1, dateStr2) {
            var d1 = dateStr1;
            var d2 = dateStr2;

            Array.from([d1, d2], function (d) {
                d = d.split("-");
                d = new Date(d[0], Number.parseInt(d[1]) - 1, d[2]);
                return d;
            });
            if (d1.getTime() >= d2.getTime()) {
                return dateStr1;
            } else {
                return dateStr2;
            }
        }
    }]);

    return date;
}();

//# sourceMappingURL=date.js.map
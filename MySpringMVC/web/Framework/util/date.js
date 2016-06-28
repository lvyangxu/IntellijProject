"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by karl on 2016/4/22.
 */

var date = function () {
    function date(value) {
        _classCallCheck(this, date);

        if (typeof value == "string") {
            var arr = value.split("-");
            var year = arr[0];
            var month = Number.parseInt(arr[1]) - 1;
            var day = arr[2];

            day = day == undefined ? 1 : day;
            var d = new Date(year, month, day);
            this.value = new Date(d.getTime());
        } else {
            this.value = value;
        }
    }

    _createClass(date, [{
        key: "toString",
        value: function toString() {
            var d = new Date(this.value.getTime());
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var day = d.getDate();

            month = month < 10 ? "0" + month : month;
            day = day < 10 ? "0" + day : day;
            return year + "-" + month + "-" + day;
        }

        /**
         * get current local day
         * @param addDays
         * @returns {string|*}
         */

    }, {
        key: "toDaysOfMonth",
        value: function toDaysOfMonth() {
            var d = new Date(this.value.getTime());
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
    }, {
        key: "monday",
        value: function monday() {
            var d = new Date(this.value.getTime());
            var dayOfWeek = d.getDay();
            if (dayOfWeek == 0) {
                dayOfWeek = 7;
            }
            var mondayNum = d.getDate() - dayOfWeek + 1;
            d.setDate(mondayNum);
            this.value = new Date(d.getTime());
            return this;
        }
    }, {
        key: "lastMonth",
        value: function lastMonth() {
            var d = new Date(this.value.getTime());
            var year = d.getFullYear();
            var month = d.getMonth();

            if (month == 0) {
                d.setFullYear(year - 1);
                d.setMonth(11);
            } else {
                d.setMonth(month - 1);
            }
            this.value = new Date(d.getTime());
            return this;
        }
    }, {
        key: "addMonth",
        value: function addMonth(addNum) {
            var d = new Date(this.value.getTime());
            var year = d.getFullYear();
            var month = d.getMonth() + 1;

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
                    year += yNum;
                    month += mNum;
                } else {
                    year += yNum - 1;
                    month += mNum + 12;
                }
            }
            var maxDaysOfMonth = new date(new Date(year, month - 1, 1)).toDaysOfMonth();
            if (d.getDate() > maxDaysOfMonth) {
                d.setDate(maxDaysOfMonth);
            }
            d.setFullYear(year);
            d.setMonth(month - 1);

            this.value = new Date(d.getTime());
            return this;
        }
    }, {
        key: "firstDay",
        value: function firstDay() {
            var d = new Date(this.value.getTime());
            d.setDate(1);
            this.value = new Date(d.getTime());
            return this;
        }
    }], [{
        key: "getLocalDay",
        value: function getLocalDay(addDays) {
            var d = new Date();
            d.setDate(d.getDate() + addDays);
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var day = d.getDate();

            var _map = [month, day].map(function (d) {
                d = d < 10 ? "0" + d : d;
                return d;
            });

            var _map2 = _slicedToArray(_map, 2);

            month = _map2[0];
            day = _map2[1];

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
    }]);

    return date;
}();

//# sourceMappingURL=date.js.map
/**
 * Created by karl on 2016/4/22.
 */
class date {

    static getDate(dateStr) {
        let arr = dateStr.split("-");
        let d = new Date(arr[0], Number.parseInt(arr[1]) - 1, arr[2]);
        return d;
    }

    static getDateStr(d) {
        let [year,month,day] = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
        month = month < 10 ? ("0" + month) : month;
        day = day < 10 ? ("0" + day) : day;
        return year + "-" + month + "-" + day;
    }

    /**
     * get current local day
     * @param addDays
     * @returns {string|*}
     */
    static getLocalDay(addDays) {
        let d = new Date();
        d.setDate(d.getDate() + addDays);
        let [year,month,day] = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
        [month, day] = [month, day].map(d=> {
            d = d < 10 ? "0" + d : d
            return d;
        })
        let result = year + "-" + month + "-" + day;
        return result;
    }

    /**
     * get current local time
     * @param addDays
     * @returns {string|*}
     */
    static getLocalTime(addDays) {
        let d = new Date();
        d.setDate(d.getDate() + addDays);
        let [year,month,day,hour,minute,second] = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
        Array.from([month, day, hour, minute, second], d=> {
            d = d < 10 ? "0" + d : d
            return d;
        })
        let result = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        return result;
    }

    /**
     * get days of the date's month have
     * @param d js date object
     * @returns {number}
     */
    static getDaysOfMonth(d) {
        let result = 0;
        let month = d.getMonth() + 1;
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
                let year = d.getFullYear();
                if (((year % 4) == 0) && ((year % 100) != 0) || ((year % 400) == 0)) {
                    result = 29
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
    static toMonday(dateStr) {
        let arr = dateStr.split("-");
        let d = new Date(arr[0], Number.parseInt(arr[1]) - 1, arr[2]);
        let dayOfWeek = d.getDay();
        if (dayOfWeek == 0) {
            dayOfWeek = 7;
        }
        let mondayNum = d.getDate() - dayOfWeek + 1;
        d.setDate(mondayNum);
        let [year,month,day] = [d.getFullYear(), Number.parseInt(d.getMonth()) + 1, d.getDate()];
        Array.from([month, day], d1=>d1 < 10 ? ("0" + d1) : d1);
        return year + "-" + month + "-" + day;
    }

    /**
     * convert yyyy-MM to it's last month string
     * @param dateStr
     * @returns {string}
     */
    static toLastMonth(dateStr) {
        let [year,month] = dateStr.split("-");
        [year, month] = [year, month].map(d=> {
            d = Number.parseInt(d);
            return d;
        });
        if (month == 1) {
            year = year - 1;
            return year + "-12";
        } else {
            let m = Number.parseInt(month - 1);
            return year + "-" + ((m < 10) ? ("0" + m) : m);
        }
    }

    /**
     * convert yyyy-MM to it's addNum month string
     * @param dateStr
     * @param addNum
     * @returns {string}
     */
    static addMonth(dateStr, addNum) {
        let [year,month] = dateStr.split("-");
        Array.from([year, month], d=>Number.parseInt(d));
        let yNum = parseInt(addNum / 12);
        let mNum = addNum % 12;
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
        month = (month < 10 ? "0" + month : month);
        return year + "-" + month;
    }

    /**
     * get the later dateStr
     * @param dateStr1
     * @param dateStr2
     * @returns {*}
     */
    static later(dateStr1, dateStr2) {
        let [d1,d2] = [dateStr1, dateStr2]
        Array.from([d1, d2], function (d) {
            d = d.split("-");
            d = new Date(d[0], Number.parseInt(d[1]) - 1, d[2]);
            return d;
        })
        if (d1.getTime() >= d2.getTime()) {
            return dateStr1;
        } else {
            return dateStr2;
        }
    }
}
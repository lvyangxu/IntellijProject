/**
 * Created by karl on 2016/4/22.
 */
class date {

    constructor(value) {
        if (typeof(value) == "string") {
            let arr = value.split("-");
            let [year,month,day] = [arr[0], Number.parseInt(arr[1]) - 1, arr[2]];
            day = (day == undefined) ? 1 : day;
            let d = new Date(year, month, day);
            this.value = new Date(d.getTime());
        } else {
            this.value = value;
        }
    }

    toString() {
        let d = new Date(this.value.getTime());
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

    toDaysOfMonth() {
        let d = new Date(this.value.getTime());
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

    monday() {
        let d = new Date(this.value.getTime());
        let dayOfWeek = d.getDay();
        if (dayOfWeek == 0) {
            dayOfWeek = 7;
        }
        let mondayNum = d.getDate() - dayOfWeek + 1;
        d.setDate(mondayNum);
        this.value = new Date(d.getTime());
        return this;
    }

    lastMonth() {
        let d = new Date(this.value.getTime());
        let [year,month] = [d.getFullYear(), d.getMonth()];
        if (month == 0) {
            d.setFullYear(year - 1);
            d.setMonth(11);
        } else {
            d.setMonth(month - 1);
        }
        this.value = new Date(d.getTime());
        return this;
    }

    addMonth(addNum) {
        let d = new Date(this.value.getTime());
        let [year,month] = [d.getFullYear(), d.getMonth() + 1];
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
                year += yNum;
                month += mNum;
            } else {
                year += yNum - 1;
                month += mNum + 12;
            }
        }
        let maxDaysOfMonth = new date(new Date(year,month-1,1)).toDaysOfMonth();
        if(d.getDate()>maxDaysOfMonth){
            d.setDate(maxDaysOfMonth);
        }
        d.setFullYear(year);
        d.setMonth(month - 1);


        this.value = new Date(d.getTime());
        return this;
    }

    firstDay(){
        let d = new Date(this.value.getTime());
        d.setDate(1);
        this.value = new Date(d.getTime());
        return this;
    }
}
package Dao;

import Models.MyException;
import Request.Parameter;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by karl on 2016/4/27.
 */
public class TableMap {

    public static String readMap(HttpServletRequest request, String table) throws MyException {
        String result = "";
        switch (table) {
            //渠道周报构成
            case "channelweeklyreport":
                result = "select * from channelweeklyreport where " + Parameter.getArraySql(request, "app") + " and " + Parameter.getStringSql(request, "name") + " and " + Parameter.getStringSql(request, "time");
                break;
            // 渠道周报
            case "channelweeklyreporttotal":
                result = "select time,name,sum(finalsetup) as setup,sum(finalcost) as cost,min(createtime) as createtime,max(updatetime) as updatetime from channelweeklyreport " +
                        "where " + Parameter.getArraySql(request, "app") + " and isvalid='true' group by name,time";
                break;
            //渠道cpi管理
            case "channeldetail":
                result = "select * from channeldetail where " + Parameter.getStringSql(request, "name");
                break;
            //渠道负责人
            case "channelmanager":
                result = "select * from user where duty = 'channelManager'";
                break;
            //渠道列表
            case "channellist":
                result = "select name from channelinfo";
                break;
            case "weeklystatistics":
            case "monthlystatistics":
                //setup and cost
                result = (table.equals("weeklystatistics"))?
                        "select time,'"+Parameter.getDecode(request,"app")+"' as app,'0' as revenue,round(sum(finalsetup)) as setup,convert(sum(finalcost),decimal(10,2)) as cost,'0' as dnu,'0' as dau,'0' as profit,'0' as profitrate from channelweeklyreport where " + Parameter.getArraySql(request, "app")+ " group by time":
                        "select concat(t.month,'-01') as time,'"+Parameter.getDecode(request,"app")+"' as app,'0' as revenue,round(sum(t.setup)) as setup,convert(sum(t.cost),decimal(10,2)) as cost,'0' as dnu,'0' as dau,'0' as profit,'0' as profitrate from ("+
                                "select concat(year(time),'-',if(length(month(time))=1,concat('0',month(time)),month(time))) as month,"+
                                "sum((if(day(LAST_DAY(time))-DAYOFMONTH(time)+1<7,finalsetup*(day(LAST_DAY(time))-DAYOFMONTH(time)+1)/7,finalsetup))) as setup,"+
                                "sum((if(day(LAST_DAY(time))-DAYOFMONTH(time)+1<7,finalcost*(day(LAST_DAY(time))-DAYOFMONTH(time)+1)/7,finalcost))) as cost from channelweeklyreport "+
                                "where "+ Parameter.getArraySql(request, "app") +
                                "group by month "+
                                "union all "+
                                "select concat(year(DATE_ADD(time,interval 6 day)),'-',if(length(month(DATE_ADD(time,interval 6 day)))=1,concat('0',month(DATE_ADD(time,interval 6 day))),month(DATE_ADD(time,interval 6 day)))) as month,"+
                                "sum((if(day(DATE_ADD(time,interval 6 day))<7,finalsetup*day(DATE_ADD(time,interval 6 day))/7,finalsetup))) as setup,"+
                                "sum((if(day(DATE_ADD(time,interval 6 day))<7,finalcost*day(DATE_ADD(time,interval 6 day))/7,finalcost))) as cost from channelweeklyreport "+
                                "where day(DATE_ADD(time,interval 6 day))<7 and "+ Parameter.getArraySql(request, "app") +
                                "group by month) as t group by month";
                break;
            case "invoice":
                result = "select *,round((table1.setup-table2.reportsetup)) as deltasetup,convert((table1.cost-table2.reportcost),decimal(10,2)) as deltacost from (select max(time) as time,name,sum(setup) as setup,sum(cost) as cost,sum(refund) as refund,paystate from invoice group by time,name,paystate) as table1";
                result += " inner join ";
                result += "(select concat(t.month,'-01') as time,t.name as name,round(sum(t.setup)) as reportsetup,convert(sum(t.cost),decimal(10,2)) as reportcost from ("
                        + "select concat(year(time),'-',if(length(month(time))=1,concat('0',month(time)),month(time))) as month,"
                        + "name,"
                        + "sum((if(day(LAST_DAY(time))-DAYOFMONTH(time)+1<7,finalsetup*(day(LAST_DAY(time))-DAYOFMONTH(time)+1)/7,finalsetup))) as setup,"
                        + "sum((if(day(LAST_DAY(time))-DAYOFMONTH(time)+1<7,finalcost*(day(LAST_DAY(time))-DAYOFMONTH(time)+1)/7,finalcost))) as cost from channelweeklyreport "
                        + "group by month,name " + "union all "
                        + "select concat(year(DATE_ADD(time,interval 6 day)),'-',if(length(month(DATE_ADD(time,interval 6 day)))=1,concat('0',month(DATE_ADD(time,interval 6 day))),month(DATE_ADD(time,interval 6 day)))) as month,"
                        + "name,"
                        + "sum((if(day(DATE_ADD(time,interval 6 day))<7,finalsetup*day(DATE_ADD(time,interval 6 day))/7,finalsetup))) as setup,"
                        + "sum((if(day(DATE_ADD(time,interval 6 day))<7,finalcost*day(DATE_ADD(time,interval 6 day))/7,finalcost))) as cost from channelweeklyreport "
                        + "where day(DATE_ADD(time,interval 6 day))<7 group by month,name) as t group by month,name) as table2 on table1.name=table2.name and table1.time=table2.time";

                break;
            case "invoicedetail":
                result = "select * from invoice where " + Parameter.getStringSql(request, "name")
                        + " and "+Parameter.getStringSql(request, "time") + " and " + Parameter.getStringSql(request, "paystate");
                break;
            default:
                result = "select * from " + table;
                break;
        }
        return result;
    }

//    public static String updateMap(String table){
//
//    }

}

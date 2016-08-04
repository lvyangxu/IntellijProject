package Dao;

import Models.MyException;
import Util.Parameter;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by karl on 2016/4/27.
 */
public class TableMap {

    public static Map<String, String> createMap(HttpServletRequest request, String table) throws MyException {
        Map<String, String> result = new HashMap<>();
        switch (table) {

        }
        return result;
    }

    public static Map<String, String> updateMap(HttpServletRequest request, String table) throws MyException {
        Map<String, String> result = new HashMap<>();
        switch (table) {

        }
        return result;
    }

    public static String readMap(HttpServletRequest request, String table) throws MyException {
        String result = "";
        switch (table) {
            case "finance_analysis":
                result = "select client,game,month,sum(cloudFront+dataTransfer+elasticCompute+keyManagement+simpleEmail" +
                        "+simpleNotification+simpleQueue+simpleStorage+support) as price from finance group by client,month,game";
                break;
            default:
                result = "select * from "+table;
                break;
        }
        return result;
    }

    public static Map<String, String> deleteMap(HttpServletRequest request, String table) throws MyException {
        Map<String, String> result = new HashMap<>();
        switch (table) {

        }
        return result;
    }

    public static String redirectMap(String table) {
        String result = "";
        switch (table) {
            //write the detail map on the main project
            default:
                result = table;
                break;
        }
        return result;
    }
}

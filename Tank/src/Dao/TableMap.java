package Dao;

import Models.MyException;
import Util.MyString;
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
            case "article":
                String name = Parameter.get(request, "name");
                result = "select * from article where name in ('" + name + "','news1','news2','activity1','activity2')";
                break;
            case "manage":
                result = "select * from article";
                break;
            case "guide":
                result = "select * from article where name like 'guide%'";
                break;
            default:
                result = "select * from " + table;
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
            case "manage":
            case "guide":
                result = "article";
                break;
            default:
                result = table;
                break;
        }
        return result;
    }
}

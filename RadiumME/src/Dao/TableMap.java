package Dao;

import Models.MyException;
import Request.Parameter;

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
            //write the detail map on the main project
            case "home-text":
            case "about-us-text":
            case "games-text":
            case "developers-text":
            case "blog-text":
            case "join-us-text":
            case "contact-us-text":
                result.put("page", "'" + table.replace("-text", "") + "'");
                break;
        }
        return result;
    }

    public static Map<String, String> updateMap(HttpServletRequest request, String table) throws MyException {
        Map<String, String> result = new HashMap<>();
        switch (table) {
            //write the detail map on the main project
            case "home-text":
            case "about-us-text":
            case "games-text":
            case "developers-text":
            case "blog-text":
            case "join-us-text":
            case "contact-us-text":
                result.put("page", "'" + table.replace("-text", "") + "'");
                break;
        }
        return result;
    }

    public static String readMap(HttpServletRequest request, String table) throws MyException {
        String result = "";
        switch (table) {
            case "home-text":
            case "about-us-text":
            case "games-text":
            case "developers-text":
            case "blog-text":
            case "join-us-text":
            case "contact-us-text":
                result = "select * from text where page='" + table.replace("-text", "") + "'";
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
            //write the detail map on the main project
            case "home-text":
            case "about-us-text":
            case "games-text":
            case "developers-text":
            case "blog-text":
            case "join-us-text":
            case "contact-us-text":
                result.put("page", "'" + table.replace("-text", "") + "'");
                break;
        }
        return result;
    }

    public static String redirectMap(String table) {
        String result = "";
        switch (table) {
            //write the detail map on the main project
            case "home-text":
            case "about-us-text":
            case "games-text":
            case "developers-text":
            case "blog-text":
            case "join-us-text":
            case "contact-us-text":
                result = "text";
                break;
            default:
                result = table;
                break;
        }
        return result;
    }
}

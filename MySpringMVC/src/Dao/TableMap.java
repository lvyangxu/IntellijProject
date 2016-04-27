package Dao;

import Models.MyException;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by karl on 2016/4/27.
 */
public class TableMap {

    public static String readMap(HttpServletRequest request, String table) throws MyException{
        String result = "";
        switch (table) {
            //write the detail map on the main project

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

package Util;

import Models.MyException;
import Util.MyString;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * Created by karl on 2016/4/20.
 */
public class Parameter {

    public static String get(HttpServletRequest request, String name) {
        String result = request.getParameter(name);
        return result;
    }

    public static String getDecode(HttpServletRequest request, String name) throws MyException {
        String result = request.getParameter(name);
        result = new MyString(result).base64Decode().toString();
        return result;
    }

    public static String getStringSql(HttpServletRequest request, String name) throws MyException {
        String result = request.getParameter(name);
        result = new MyString(result).base64Decode().toString();
        result = name + "='" + result + "'";
        return result;
    }

    public static String getIntSql(HttpServletRequest request, String name) throws MyException {
        String result = request.getParameter(name);
        result = new MyString(result).base64Decode().toString();
        result = name + "=" + result + "";
        return result;
    }

    public static String getArraySql(HttpServletRequest request, String name) throws MyException {
        String result = request.getParameter(name);
        result = new MyString(result).base64Decode().toString();
        String[] arr = new MyString(result).split(",");
        result = Arrays.stream(arr).map(d -> {
            d = "'" + d + "'";
            return d;
        }).collect(Collectors.joining(","));

        result = name + "in (" + result + ")";
        return result;
    }

}

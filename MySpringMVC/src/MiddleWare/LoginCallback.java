package MiddleWare;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by karl on 2016/7/1.
 */
public class LoginCallback {

    public static void success(HttpServletRequest request, HttpServletResponse response){

    }

    public static void success(HttpServletRequest request, HttpServletResponse response, String username, String password) {

    }

    public static void failed(HttpServletRequest request, HttpServletResponse response){

    }
}

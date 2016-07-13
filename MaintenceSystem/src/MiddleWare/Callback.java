package MiddleWare;

import Init.Init;
import Models.MyException;
import Util.MyString;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Created by karl on 2016/7/1.
 */
public class Callback {

    public static void login(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        String username = Util.Session.get(request, "username");
        if (username == null) {
            //login failed callback

        } else {
            //login success callback
            try {
                Init.mysql.update("insert into user_login set id=null,user='" + username + "',ip='" + request.getRemoteAddr() + "',login_time=now()");
            } catch (MyException e) {
                Init.log4j.error("add user login history failed:" + e.getMessage());
            }
        }

    }


}

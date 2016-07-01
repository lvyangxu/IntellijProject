package MiddleWare;

import Init.Init;
import Models.MyException;
import Request.Parameter;
import Util.MyString;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by karl on 2016/7/1.
 */
public class LoginCallback {

    public static void success(HttpServletRequest request, HttpServletResponse response) {
        try {
            String user = Parameter.get(request, "username");
            if(user==null){
                throw new MyException("null username");
            }
            user = new MyString(user).base64Decode().toString();
            Init.mysql.update("insert into user_login set id=null,user='"+user+"',ip='"+request.getRemoteAddr()+"',login_time=now()");
        } catch (MyException e) {
            Init.log4j.error("add user login history failed:" + e.getMessage());
        }
    }

    public static void failed(HttpServletRequest request, HttpServletResponse response) {

    }
}

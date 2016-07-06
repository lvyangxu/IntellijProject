package Util;

import MiddleWare.Account;
import Models.MyException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import static Init.Init.passwordCookieName;
import static Init.Init.usernameCookieName;

/**
 * Created by karl on 2016/4/20.
 */
public class Session {

    /**
     * get session by name
     * @param request
     * @param sessionName
     * @return
     */
    public static String get(HttpServletRequest request,String sessionName){
        Object result = request.getSession().getAttribute(sessionName);
        if(result == null){
            return null;
        }else {
            return result.toString();
        }
    }

    /**
     * set session
     * @param request
     * @param sessionName
     * @param sessionValue
     */
    public static void set(HttpServletRequest request,String sessionName,Object sessionValue){
        request.getSession().setAttribute(sessionName,sessionValue);
        request.getSession().setMaxInactiveInterval(21600);
    }



}

package Util;

import Models.MyException;

import javax.servlet.http.HttpServletRequest;

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

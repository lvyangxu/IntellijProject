package Util;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by karl on 2016/4/26.
 */
public class Cookie {

    public static String get(HttpServletRequest request,String cookieName){
        String result = null;
        javax.servlet.http.Cookie[] CookiesArr = request.getCookies();
        if(CookiesArr == null){
            return result;
        }

        for (javax.servlet.http.Cookie Cookie1 : CookiesArr) {
            if (Cookie1.getName().equals(cookieName)) {
                result = Cookie1.getValue();
            }
        }
        return result;
    }
}

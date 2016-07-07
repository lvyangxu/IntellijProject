package MiddleWare;

import Models.MyException;
import Util.Cookie;
import Util.MyString;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import static Init.Init.passwordCookieName;
import static Init.Init.usernameCookieName;

/**
 * Created by karl on 2016/7/6.
 */
public class Session {

    public static void authenticate(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws MyException {
        if (session.getAttribute("username") == null) {
            String username = Cookie.get(request, usernameCookieName);
            //all cookie save with base64 encode
            try {
                username = new MyString(username).urlDecode().base64Decode().toString();
            } catch (Exception e) {
                throw new MyException("unauthorised");
            }
            String password = Cookie.get(request, passwordCookieName);
            try {
                password = new MyString(password).urlDecode().base64Decode().toString();
            } catch (Exception e) {
                throw new MyException("unauthorised");
            }

            Account.validate(request, response, session, username, password);
        }
    }


}

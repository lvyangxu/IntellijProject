package MiddleWare;

import Models.Account;
import Models.MyException;
import Request.Cookie;
import Request.Parameter;
import Util.MyString;
import jdk.nashorn.internal.objects.Global;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import static Init.Init.passwordCookieName;
import static Init.Init.usernameCookieName;

/**
 * Created by karl on 2016/4/20.
 */
public class Session {
     public static void authenticate(HttpServletRequest request, HttpSession session) throws MyException {
          if (session.getAttribute("username") == null) {
               String account = Cookie.get(request, usernameCookieName);
              //all cookie save with base64 encode
              try {
                  account = new MyString(account).urlDecode().base64Decode().toString();
              } catch (Exception e) {
                  throw new MyException("invalid account cookie:"+account);
              }
               String password = Cookie.get(request, passwordCookieName);
              try {
                  password = new MyString(password).urlDecode().base64Decode().toString();
              } catch (Exception e) {
                  throw new MyException("invalid password cookie:"+password);
              }
              Account.authenticate(account,password);
          }
     }


}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyLibrary;

import java.io.PrintWriter;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author anshifafeng
 */
public class DoServletContext extends HttpServlet{
//
//    DoDataTranslation DoCode1 = new DoDataTranslation();
//

//
//
//    /**
//     * get request para value by name
//     * @param request
//     * @param paraName
//     * @return if null return ""
//     */
//    public String getRequestPara(HttpServletRequest request,String paraName){
//        if(request.getParameter(paraName)==null){
//            return "";
//        }else{
//            return request.getParameter(paraName);
//        }
//    }
//
//
//
//    public String getSession(HttpServletRequest request, String sessionName) {
//        HttpSession session=request.getSession();
//        if (session.getAttribute(sessionName) == null) {
//            return "";
//        } else {
//            return session.getAttribute(sessionName).toString();
//        }
//    }
//
//    public static void setSession(HttpServletRequest request, String sessionName,String sessionValue) throws Exception{
//        HttpSession session = request.getSession();
//        session.setAttribute(sessionName, sessionValue);
//    }
//
//    public static String getCookie(HttpServletRequest request, String cookieName) throws Exception{
//        String result = "";
//        Cookie[] CookiesArr = request.getCookies();
//        for (Cookie Cookie1 : CookiesArr) {
//            if (Cookie1.getName().equals(cookieName)) {
//                result = Cookie1.getValue();
//            }
//        }
//        return result;
//    }
//
////    public String setCookie(HttpServletRequest request, String cookieName,String cookieValue) {
////        String result = null;
////        Cookie[] CookiesArr = request.getCookies();
////        for (Cookie Cookie1 : CookiesArr) {
////            if (Cookie1.getName().equals(cookieName)) {
////                result = Cookie1.getValue();
////            }
////        }
////        return result;
////    }
//
//
//    public void setSessionTime(HttpServletRequest request,int secondTime) {
//        HttpSession HttpSession1 = request.getSession();
//        HttpSession1.setMaxInactiveInterval(21600);
//    }
//
//    public boolean reLogin(HttpServletRequest request, String serverAccount, String serverPassword) throws Exception{
//        String account = getCookie(request, "account");
//        String password = getCookie(request, "password");
//        account = Str.decode(account,"base64");
//        password = Str.decode(password,"base64");
//        if (account.equals(serverAccount)  && password.equals(serverPassword) ) {
//            setSession(request, "account", account);
//            setSession(request, "password", password);
//            setSessionTime(request,21600);
//            return true;
//        } else {
//            return false;
//        }
//    }

}

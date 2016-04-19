package Models;


import javax.servlet.http.HttpServletRequest;
import java.lang.annotation.Annotation;

/**
 * Created by karl on 2016/4/12.
 */
public class Account{



    /**
     * 执行登录
     * @param request
     * @param username
     * @param password
     * @return 成功返回null,失败
     */
    public static String doLogin(HttpServletRequest request, String username, String password) throws Exception{
//        Class clazz = Class.forName("Init");
//
//        Annotation[] annotations = clazz.getAnnotations();
//        for (Annotation annotation : annotations) {
//            Init.Global testA = (Init.Global) annotation;
//            System.out.println("id= " + testA.group() + "; name= " + testA.name() + "; gid = " + testA.name());
//        }
        return "";
//        //查询user表
//        String sqlCommand = "select username,password from user";
//        List<List<String>> resulList = Mysql.doMysqlSelect1(sqlCommand);
//        if(mysqlClass1.getExceptionString()!=null){
//            return "sqlError";
//        }
//        boolean isValidUser = false;
//        for(List<String> row:resulList){
//            String usernameInSql = row.get(0);
//            String passwordInSql = row.get(1);
//            if(usernameInSql==null||passwordInSql==null){
//                continue;
//            }
//            if (username.equals(usernameInSql) && password.equals(passwordInSql)) {
//                isValidUser = true;
//            }
//        }
//
//        if (isValidUser) {
//            try {
//                DoServletContext.setSession(request, "username", username);
//            } catch (Exception e) {
//                Init.log4j.error().info(e.getMessage());
//            }
//            return null;
//        } else {
//            return "errorAccount";
//        }
    }

    /**
     * check session,if expired,dologin with cookie
     * @param session HttpSession
     * @param request HttpServletRequest
     * @return 成功返回null,失败返回json串
     */
//    public static String checkLogin(HttpSession session, HttpServletRequest request) {
//        if (session.getAttribute("username") == null) {
//            String account = DoServletContext.getCookie(request, Global.usernameCookieNameConfig);
//            account = UDecoder.URLDecode(account);
//            account = Str.decode(account,"base64");
//            String password = DoServletContext1.getCookie(request, Global.passwordCookieNameConfig);
//            password = UDecoder.URLDecode(password);
//            password = Str.decode(password,"base64");
//            String loginResult = doLogin(request,account, password);
//            if (loginResult != null) {
//                return "{\"success\":\"false\",\"message\":\"relogin\"}";
//            }
//            DoServletContext1.setSession(request, "username", account);
//        }
//        return null;
//    }
}

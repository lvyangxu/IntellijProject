package Models;

import Request.Parameter;
import Util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

import static Init.Init.mysql;

/**
 * Created by karl on 2016/4/12.
 */
public class Account {

    /**
     * login
     * @param request
     * @param session
     * @throws MyException
     */
    public static void login(HttpServletRequest request, HttpSession session) throws MyException {
        String result = null;
        //get username and password in request
        String usernameP = Parameter.get(request, "username");
        String passwordP = Parameter.get(request, "password");
        if(usernameP==null){
            throw new MyException("empty username");
        }
        if(passwordP==null){
            throw new MyException("empty password");
        }

        try {
            usernameP = new MyString(usernameP).base64Decode().toString();
        } catch (Exception e) {
            throw new MyException("invalid username");
        }

        try {
            passwordP = new MyString(passwordP).base64Decode().toString();
        } catch (Exception e) {
            throw new MyException("invalid password");
        }

        authenticate(usernameP,passwordP);

    }

    /**
     * check session
     * @param usernameP
     * @param passwordP
     * @throws MyException
     */
    public static void authenticate(String usernameP,String passwordP) throws MyException {
        //get username and password in mysql and validate them
        boolean isValid = false;
        for (List<String> row : mysql.select("select username,password from user").rows()) {
            String usernameM = row.get(0);
            String passwordM = row.get(1);
            if (usernameP.equals(usernameM)) {
                if (passwordP.equals(passwordM)) {
                    isValid = true;
                    break;
                } else {
                    throw new MyException("relogin:invalid password");
                }
            }
        }

        if (!isValid) {
            throw new MyException("relogin:invalid username");
        }
    }
}

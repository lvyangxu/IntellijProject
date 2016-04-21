package Models;

import Request.Parameter;
import Util.*;
import Util.Mysql;
import org.dom4j.DocumentException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.lang.annotation.Annotation;
import java.util.List;

import static Init.Init.WebRoot;
import static Init.Init.log4j;
import static Init.Init.mysql;

/**
 * Created by karl on 2016/4/12.
 */
public class Account {

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
            usernameP = new MyString(usernameP).decode("base64").toString();
        } catch (Exception e) {
            throw new MyException("invalid username");
        }

        try {
            passwordP = new MyString(passwordP).decode("base64").toString();
        } catch (Exception e) {
            throw new MyException("invalid password");
        }
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
                    throw new MyException("invalid password");
                }
            }
        }

        if (!isValid) {
            throw new MyException("invalid username");
        }

    }
}

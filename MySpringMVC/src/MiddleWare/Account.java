package MiddleWare;

import Models.MyException;
import Util.Parameter;
import Util.MyString;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.List;

import static Init.Init.mysql;

/**
 * Created by karl on 2016/7/6.
 */
public class Account {

    /**
     * login
     *
     * @param request
     * @param session
     * @throws MyException
     */
    public static void login(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws MyException {
        String result = null;
        //get username and password in request
        String username = Parameter.get(request, "username");
        String password = Parameter.get(request, "password");
        if (username == null) {
            throw new MyException("empty username");
        }
        if (password == null) {
            throw new MyException("empty password");
        }

        try {
            username = new MyString(username).base64Decode().toString();
        } catch (Exception e) {
            throw new MyException("invalid username");
        }

        try {
            password = new MyString(password).base64Decode().toString();
        } catch (Exception e) {
            throw new MyException("invalid password");
        }

        validate(request, response, session, username, password);
    }

    /**
     * validate username and password in mysql
     *
     * @param username
     * @param password
     * @throws MyException
     */
    public static void validate(HttpServletRequest request, HttpServletResponse response, HttpSession session, String username, String password) throws MyException {

        //get username and password in mysql and validate them
        boolean isValid = false;
        for (List<String> row : mysql.select("select username,password from user").rows()) {
            String usernameM = row.get(0);
            String passwordM = row.get(1);
            if (username.equals(usernameM)) {
                if (password.equals(passwordM)) {
                    isValid = true;
                    Util.Session.set(request, "username", username);

                    //login callback
                    MiddleWare.Callback.login(request, response, session);

                    break;
                } else {
                    //login callback
                    MiddleWare.Callback.login(request, response, session);

                    throw new MyException("unauthorised");
                }
            }
        }
        if (!isValid) {
            //login callback
            MiddleWare.Callback.login(request, response, session);

            throw new MyException("unauthorised");
        }
    }
}

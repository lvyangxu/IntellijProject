package Controllers;

import Models.MyException;
import Models.MyMvcObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Created by karl on 2016/4/12.
 */
@Controller
@SessionAttributes("session")
@RequestMapping(value = "/Account")
public class Account {

    @RequestMapping(value = "/DoLogin")
    public void doLogin(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        MyMvcObject MyMvcObject1 = new MyMvcObject(request, response, session);
        try {
            MyMvcObject1.login().success();
            MiddleWare.LoginCallback.success(request, response);
        } catch (MyException e) {
            MyMvcObject1.fail(e.getMessage());
            MiddleWare.LoginCallback.failed(request, response);
        }
    }

    @RequestMapping(value = "/DoLogout")
    public String doLogout(HttpSession session) {
        session.setAttribute("username", null);
        return "/login";
    }

    @RequestMapping(value = "/GetCookieName")
    public void getCookieName(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        MyMvcObject MyMvcObject1 = new MyMvcObject(request, response, session);
        MyMvcObject1.getCookieName().success();
    }
}
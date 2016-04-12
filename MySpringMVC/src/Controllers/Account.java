package Controllers;

import MyLibrary.DoServletContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created by karl on 2016/4/12.
 */
@Controller
@SessionAttributes("session")
@RequestMapping(value = "/Account")
public class Account {

    DoServletContext DoServletContext1 = new DoServletContext();

    @ResponseBody
    @RequestMapping(value="/DoLogin")
    public String doLogin(HttpServletRequest request, HttpSession session) throws Exception{
        String result = null;
        String username = DoServletContext1.getRequestPara(request, "username");
        String password = DoServletContext1.getRequestPara(request, "password");
        String loginResult = Models.Account.doLogin(request,username, password);
        if (loginResult == null) {
            session.setAttribute("username", username);
            result = "{\"success\":\"true\",\"message\":\"\"}";
        } else {
            result = "{\"success\":\"false\",\"message\":\"errorAccount\"}";
        }
        return result;


    }

    @RequestMapping(value="/DoLogout")
    public String doLogout(HttpSession session){
        session.setAttribute("username", null);
        return "/login";
    }
}

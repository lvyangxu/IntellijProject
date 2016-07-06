package Controllers;

import Models.MyException;
import Models.MyMvcObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Created by karl on 2016/7/6.
 */
@Controller
public class Authenticate {

    /**
     * receive a http request and authenticate first,then server will set sessionId cookie
     * @param request
     * @param response
     * @param session
     */
    @RequestMapping(value = "/Authenticate")
    public void authenticate(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        MyMvcObject MyMvcObject1 = new MyMvcObject(request, response, session);
        try {
            MyMvcObject1.authenticate().success();
        } catch (MyException e) {
            MyMvcObject1.fail(e.getMessage());
        }
    }


}

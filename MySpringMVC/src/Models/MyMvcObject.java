package Models;

import MiddleWare.Response;
import org.springframework.ui.Model;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Created by karl on 2016/4/19.
 */
public class MyMvcObject {

    private HttpServletRequest request;
    private HttpServletResponse response;
    private HttpSession session;
    private MyMvcObject This;

    public MyMvcObject(HttpServletRequest request,HttpServletResponse response, HttpSession session) {
        this.request = request;
        this.response = response;
        this.session = session;
        This = this;
    }

    public MyMvcObject login() throws MyException {
        Account.login(this.request,this.session);
        return this;
    };

    public void success()  {
        Response.success(this.response);
    }

    public void fail(String messgae) {
        Response.fail(this.response,messgae);
    }

}

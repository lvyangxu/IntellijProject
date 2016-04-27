package Models;

import MiddleWare.*;
import Response.Response;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import static Init.Init.loginRedirectUrl;
import static Init.Init.passwordCookieName;
import static Init.Init.usernameCookieName;

/**
 * Created by karl on 2016/4/19.
 */
public class MyMvcObject {

    private HttpServletRequest request;
    private HttpServletResponse response;
    private HttpSession session;
    private MyMvcObject This;
    private String responseMessage = "";
    private String sqlCommand = "";

    public MyMvcObject(HttpServletRequest request,HttpServletResponse response, HttpSession session) {
        this.request = request;
        this.response = response;
        this.session = session;
        This = this;
    }

    public MyMvcObject login() throws MyException {
        Account.login(this.request,this.session);
        this.responseMessage = loginRedirectUrl;
        return this;
    };

    public void success() {
        Response.success(this.response,this.responseMessage);
    }

    public void fail(String messgae) {
        Response.fail(this.response,messgae);
    }

    public MyMvcObject authenticate() throws MyException {
        MiddleWare.Session.authenticate(this.request,this.session);
        return this;
    }

    public MyMvcObject getCookieName(){
        this.responseMessage = "{\"username\":\""+usernameCookieName+"\",\"password\":\""+passwordCookieName+"\"}";
        return this;
    }

    public MyMvcObject readMap(String name) throws MyException {
        this.sqlCommand = Dao.TableMap.readMap(this.request,name);
        return this;
    }

    public MyMvcObject read(String table) throws MyException {
        this.responseMessage = Table.read(table,this.sqlCommand);
        return this;
    }

}

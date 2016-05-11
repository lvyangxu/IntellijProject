package Models;

import MiddleWare.*;
import Request.Parameter;
import Response.Response;
import Util.MyString;
import Util.Poi;

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

    public MyMvcObject export() throws MyException {
        //get request data
        String fileName = Parameter.get(this.request,"title");
        String data = Parameter.get(this.request,"data");
        MyString MyString1 = new MyString("data");
        data = MyString1.base64Decode().toString();

        //save data in excel

        String filePath = "";
        String title = fileName;
        StringBuilder StringBuilder1 = new StringBuilder();
        Poi.creatExcel(filePath, title,StringBuilder1);
        Response.file(this.response,filePath,fileName);
        return this;
    }

}

package Models;

import Init.Init;
import MiddleWare.*;
import Request.Parameter;
import Response.Response;
import Util.MyString;
import Util.Path;
import Util.Poi;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static Init.Init.*;

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
    private String redirectTable;
    private Map<String, String> defaultMap = new HashMap<>();

    public MyMvcObject(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        this.request = request;
        this.response = response;
        this.session = session;
        This = this;
    }

    public MyMvcObject login() throws MyException {
        Account.login(this.request, this.session);
        this.responseMessage = loginRedirectUrl;
        return this;
    }

    public void success() {
        Response.success(this.response, this.responseMessage);
    }

    public void fail(String messgae) {
        Response.fail(this.response, messgae);
    }

    public void unauthorised() throws MyException {
        fail("unauthorised");
    }

    public MyMvcObject authenticate() throws MyException {
        MiddleWare.Session.authenticate(this.request, this.session);
        return this;
    }

    public MyMvcObject getCookieName() {
        this.responseMessage = "{\"username\":\"" + usernameCookieName + "\",\"password\":\"" + passwordCookieName + "\"}";
        return this;
    }

    public MyMvcObject redirectMap(String table) throws MyException {
        this.redirectTable = Dao.TableMap.redirectMap(table);
        return this;
    }

    public MyMvcObject createMap(String table) throws MyException {
        this.defaultMap = Dao.TableMap.createMap(this.request, table);
        return this;
    }

    public MyMvcObject create(String table) throws MyException {
        table = (this.redirectTable == "") ? table : this.redirectTable;
        Table.create(this.request, table, this.defaultMap);
        return this;
    }

    public MyMvcObject updateMap(String table) throws MyException {
        this.defaultMap = Dao.TableMap.updateMap(this.request, table);
        return this;
    }

    public MyMvcObject update(String table) throws MyException {
        table = (this.redirectTable == "") ? table : this.redirectTable;
        Table.update(this.request, table, this.defaultMap);
        return this;
    }

    public MyMvcObject readMap(String table) throws MyException {
        this.sqlCommand = Dao.TableMap.readMap(this.request, table);
        return this;
    }

    public MyMvcObject read(String table) throws MyException {
        table = (this.redirectTable == "") ? table : this.redirectTable;
        this.responseMessage = Table.read(table, this.sqlCommand);
        return this;
    }

    public MyMvcObject deleteMap(String table) throws MyException {
        this.defaultMap = Dao.TableMap.deleteMap(this.request, table);
        return this;
    }

    public MyMvcObject delete(String table) throws MyException {
        table = (this.redirectTable == "") ? table : this.redirectTable;
        Table.delete(this.request, table, this.defaultMap);
        return this;
    }


    /**
     * export table data
     *
     * @param table
     * @return
     * @throws MyException
     */
    public MyMvcObject export(String table) throws MyException {
        //get request data
        String title = Parameter.get(this.request, "title");
        title = new MyString(title).base64Decode().toString();
        String data = Parameter.get(this.request, "data");
        data = new MyString(data).base64Decode().toString();

        //save data in excel
        String filePath = WebRoot + "/Data/" + table + "/";
        Path.create(filePath);
        String fileName = title + ".xlsx";
        StringBuilder StringBuilder1 = new StringBuilder(data);
        Poi.creatExcel(filePath + fileName, title, StringBuilder1);
        this.responseMessage = fileName;
        return this;
    }

}

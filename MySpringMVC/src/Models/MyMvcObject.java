package Models;

import MiddleWare.*;
import Util.Parameter;
import MiddleWare.Response;
import Util.MyString;
import Util.Path;
import Util.Poi;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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

    /**
     * constructed function
     *
     * @param request
     * @param response
     * @param session
     */
    public MyMvcObject(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        this.request = request;
        this.response = response;
        this.session = session;
        This = this;
    }

    /**
     * do login
     *
     * @return
     * @throws MyException
     */
    public MyMvcObject login() throws MyException {
        Account.login(this.request, this.response, this.session);
        this.responseMessage = loginRedirectUrl;
        return this;
    }

    /**
     * response success json message
     */
    public void success() {
        Response.success(this.response, this.responseMessage);
    }

    /**
     * response fail json message
     *
     * @param messgae
     */
    public void fail(String messgae) {
        Response.fail(this.response, messgae);
    }

    /**
     * response excel file
     * @param table
     * @throws MyException
     */
    public void excel(String table) throws MyException {
        Response.excel(this.request, this.response, table);
    }

    public void attachmentList(String table) throws MyException {
        String[] arr = Path.getFileNameList(WebRoot+"Data/"+table+"/");
        String a = "";
    }

    /**
     * check session and do login if unauthorized
     *
     * @return
     * @throws MyException
     */
    public MyMvcObject authenticate() throws MyException {
        MiddleWare.Session.authenticate(this.request, this.response, this.session);
        return this;
    }

    /**
     * get application cookie name
     *
     * @return
     */
    public MyMvcObject getCookieName() {
        this.responseMessage = "{\"username\":\"" + usernameCookieName + "\",\"password\":\"" + passwordCookieName + "\"}";
        return this;
    }

    /**
     * mysql redirect map
     *
     * @param table
     * @return
     * @throws MyException
     */
    public MyMvcObject redirectMap(String table) throws MyException {
        this.redirectTable = Dao.TableMap.redirectMap(table);
        return this;
    }

    /**
     * mysql create map
     *
     * @param table
     * @return
     * @throws MyException
     */
    public MyMvcObject createMap(String table) throws MyException {
        this.defaultMap = Dao.TableMap.createMap(this.request, table);
        return this;
    }

    /**
     * mysql create
     *
     * @param table
     * @return
     * @throws MyException
     */
    public MyMvcObject create(String table) throws MyException {
        table = (this.redirectTable == "") ? table : this.redirectTable;
        Table.create(this.request, table, this.defaultMap);
        return this;
    }

    /**
     * mysql update map
     *
     * @param table
     * @return
     * @throws MyException
     */
    public MyMvcObject updateMap(String table) throws MyException {
        this.defaultMap = Dao.TableMap.updateMap(this.request, table);
        return this;
    }

    /**
     * mysql update
     *
     * @param table
     * @return
     * @throws MyException
     */
    public MyMvcObject update(String table) throws MyException {
        table = (this.redirectTable == "") ? table : this.redirectTable;
        Table.update(this.request, table, this.defaultMap);
        return this;
    }

    /**
     * mysql read map
     *
     * @param table
     * @return
     * @throws MyException
     */
    public MyMvcObject readMap(String table) throws MyException {
        this.sqlCommand = Dao.TableMap.readMap(this.request, table);
        return this;
    }

    /**
     * mysql read
     *
     * @param table
     * @return
     * @throws MyException
     */
    public MyMvcObject read(String table) throws MyException {
        table = (this.redirectTable == "") ? table : this.redirectTable;
        this.responseMessage = Table.read(table, this.sqlCommand);
        return this;
    }

    /**
     * mysql delete map
     *
     * @param table
     * @return
     * @throws MyException
     */
    public MyMvcObject deleteMap(String table) throws MyException {
        this.defaultMap = Dao.TableMap.deleteMap(this.request, table);
        return this;
    }

    /**
     * mysql delete
     *
     * @param table
     * @return
     * @throws MyException
     */
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

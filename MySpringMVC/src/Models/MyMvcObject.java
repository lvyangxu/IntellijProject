package Models;

import Dao.Mysql;
import Init.Init;
import MiddleWare.*;
import Util.*;
import MiddleWare.Response;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

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
    private Mysql.data mysqlData;

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

    public void success(String message) {
        this.responseMessage = message;
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
     *
     * @param table
     * @throws MyException
     */
    public void excel(String table) throws MyException {
        String filePath = "Data/export/" + table + "/";
        String fileName = Parameter.get(request, "fileName");
        fileName = new MyString(fileName).base64Decode().toString();
        fileName += ".xlsx";
        Response.download(this.response, filePath, fileName);
    }

    /**
     * get attachment list
     *
     * @param table
     * @return
     * @throws MyException
     */
    public MyMvcObject attachmentList(String table) throws MyException {
        String id = Parameter.get(this.request, "id");
        id = new MyString(id).base64Decode().toString();
        List<File> fileList = Path.getChildrenFile(WebRoot + "Data/attachment/" + table + "/" + id + "/");
        String result = fileList.stream().map(d -> {
            String name = d.getName();
            long size = d.length();
            String json = "{\"name\":\"" + name + "\",\"size\":\"" + String.valueOf(size) + "\"}";
            return json;
        }).collect(Collectors.joining(","));
        result = "[" + result + "]";
        this.responseMessage = result;
        return this;
    }

    /**
     * download attachment
     *
     * @param table
     * @throws MyException
     */
    public void attachmentDownload(String table) throws MyException {
        String id = Parameter.get(this.request, "id");
        id = new MyString(id).base64Decode().toString();
        String fileName = Parameter.get(this.request, "fileName");
        fileName = new MyString(fileName).base64Decode().toString();

        String filePath = "Data/attachment/" + table + "/" + id + "/";
        Response.download(response, filePath, fileName);
    }

    /**
     * preview attachment
     *
     * @param table
     * @throws MyException
     */
    public void attachmentPreview(String table) throws MyException {
        String id = Parameter.get(this.request, "id");
        id = new MyString(id).base64Decode().toString();
        String fileName = Parameter.get(this.request, "fileName");
        fileName = new MyString(fileName).base64Decode().toString();

        String filePath = "Data/attachment/" + table + "/" + id + "/";
        Response.file(response, filePath, fileName);
    }

    /**
     * delete attachment
     *
     * @param table
     * @throws MyException
     */
    public MyMvcObject attachmentDelete(String table) throws MyException {
        String id = Parameter.get(this.request, "id");
        id = new MyString(id).base64Decode().toString();
        String fileName = Parameter.get(this.request, "fileName");
        String[] fileNameArr = new MyString(fileName).split(",");
        String filePath = "Data/attachment/" + table + "/" + id + "/";
        for (String fileNameStr : fileNameArr) {
            fileNameStr = new MyString(fileNameStr).base64Decode().toString();
            MyFile.delete(WebRoot + filePath + fileNameStr);
        }
        return this;
    }

    /**
     * get upload file and save it
     *
     * @param table
     * @return
     * @throws MyException
     */
    public MyMvcObject attachmentUpload(String table) throws MyException {
        String id = Parameter.get(this.request, "id");
        id = new MyString(id).base64Decode().toString();
        String filePath = "Data/attachment/" + table + "/" + id + "/";
        String fileName = Upload.springMvcFileUpload(this.request, this.response, WebRoot + filePath);
        Callback.attachmentUpload(this.request, this.response, this.session, table, WebRoot + filePath, fileName);
        return this;
    }

    public MyMvcObject attachmentBatchCreate(String table) throws MyException {
        String id = Parameter.get(request, "id");
        String[] arr = new MyString(id).split(",");
        Map<String, Integer> zipMap = new HashMap<>();
        List<String> zipDirectoryList = new ArrayList<>();
        for (String idStr : arr) {
            idStr = new MyString(idStr).base64Decode().toString();
            String path = WebRoot + "Data/attachment/" + table + "/" + idStr + "/";
            zipMap.put(path, 1);
        }
        Zip.zip(zipMap, WebRoot + "Data/attachment/" + table + "/" + table + ".zip");
        return this;
    }

    public void attachmentBatchDownload(String table) throws MyException {
        String filePath = "Data/attachment/" + table + "/";
        String fileName = table + ".zip";
        Response.download(response, filePath, fileName);
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
        this.responseMessage = Table.read(this.sqlCommand);
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
        String filePath = WebRoot + "/Data/export/" + table + "/";
        Path.create(filePath);
        String fileName = title + ".xlsx";
        StringBuilder StringBuilder1 = new StringBuilder(data);
        Poi.creatExcel(filePath + fileName, title, StringBuilder1);
        this.responseMessage = fileName;
        return this;
    }

    /**
     * mysql update with given sqlCommand
     * @param sqlCommand
     * @return
     * @throws MyException
     */
    public MyMvcObject executeUpdate(String sqlCommand) throws MyException{
        Init.log4j.database("try executeUpdate:" + sqlCommand);
        mysql.update(sqlCommand);
        return this;
    }

    /**
     * mysql batch with given sqlCommandList
     * @param sqlCommandList
     * @return
     * @throws MyException
     */
    public MyMvcObject executeBatch(List<String> sqlCommandList) throws MyException{
        Init.log4j.database("try executeBatch:" + sqlCommandList.toString());
        mysql.batch(sqlCommandList);
        return this;
    }

    /**
     * read table with given sqlCommand
     * @param table
     * @param sqlCommand
     * @return
     * @throws MyException
     */
    public MyMvcObject executeQuery(String sqlCommand) throws MyException{
        this.sqlCommand = sqlCommand;
        Init.log4j.database("try executeQuery:" + sqlCommand);
        Mysql.data data = mysql.select(sqlCommand);
        this.mysqlData = data;
        this.responseMessage = data.toJson();
        return this;
    }

    public Mysql.data getMysqlData(){
        return this.mysqlData;
    }

}

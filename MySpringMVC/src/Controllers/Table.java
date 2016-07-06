package Controllers;

import Models.MyException;
import Models.MyMvcObject;
import Util.Parameter;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Created by karl on 2016/4/26.
 */
@Controller
@SessionAttributes("session")
@RequestMapping(value = "/Table")
public class Table {

    @RequestMapping(value = "/{table}/{type}")
    public void table(HttpServletRequest request, HttpServletResponse response, HttpSession session, @PathVariable String table,@PathVariable String type){
        MyMvcObject MyMvcObject1 = new MyMvcObject(request,response, session);
        try {
            switch (type){
                case "Create":
                    MyMvcObject1.authenticate().createMap(table).redirectMap(table).create(table).success();
                    break;
                case "Update":
                    MyMvcObject1.authenticate().updateMap(table).redirectMap(table).update(table).success();
                    break;
                case "Read":
                    MyMvcObject1.authenticate().readMap(table).redirectMap(table).read(table).success();
                    break;
                case "Delete":
                    MyMvcObject1.authenticate().deleteMap(table).redirectMap(table).delete(table).success();
                    break;
                case "ExportCreate":
                    MyMvcObject1.authenticate().export(table).success();
                    break;
                case "ExportDownload":
                    MyMvcObject1.authenticate().excel(table);
                    break;
                case "AttachmentList":
                    MyMvcObject1.authenticate().attachmentList(table);
                    break;
            }
        } catch (MyException e) {
            MyMvcObject1.fail(e.getMessage());
        }
    }

}

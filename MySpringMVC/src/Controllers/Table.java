package Controllers;

import Models.MyException;
import Models.MyMvcObject;
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

    @RequestMapping(value = "/{name}/{type}")
    public void table(HttpServletRequest request, HttpServletResponse response, HttpSession session, @PathVariable String name,@PathVariable String type){
        MyMvcObject MyMvcObject1 = new MyMvcObject(request,response, session);
        try {
            switch (type){
                case "Create":
                    MyMvcObject1.authenticate().createMap(name).redirectMap(name).create(name).success();
                    break;
                case "Update":
                    MyMvcObject1.authenticate().updateMap(name).redirectMap(name).update(name).success();
                    break;
                case "Read":
                    MyMvcObject1.authenticate().readMap(name).redirectMap(name).read(name).success();
                    break;
                case "Delete":
                    MyMvcObject1.authenticate().deleteMap(name).redirectMap(name).delete(name).success();
                    break;
                case "Export":
                    MyMvcObject1.authenticate().export(name).success();
                    break;
            }
        } catch (MyException e) {
            if(e.getMessage().equals("authenticate failed")){
                try {
                    MyMvcObject1.unauthorised();
                } catch (MyException e1) {
                    MyMvcObject1.fail("unauthorised redict failed");
                }
            }else {
                MyMvcObject1.fail(e.getMessage());
            }

        }
    }

}

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
                    break;
                case "Update":
                    break;
                case "Read":
                    MyMvcObject1.authenticate().readMap(name).read(name).success();
                    break;
                case "Delete":
                    break;
                case "Export":
                    MyMvcObject1.authenticate();
                    break;
            }
        } catch (MyException e) {
            MyMvcObject1.fail(e.getMessage());
        }
    }

}

package Routers;

import Models.MyException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by 杨旭 on 2016/4/3.
 */
@Controller
public class Router {

    @RequestMapping(value = {"/{viewName}/"})
    public String router(@PathVariable String viewName) {
        return  "/"+viewName+"/index";
    }

    @RequestMapping(value = {"/{viewName}/{name}"})
    public String router1(@PathVariable String viewName,@PathVariable String name) {
        return  "/"+viewName+"/"+name;
    }


}

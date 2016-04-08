package Routers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

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

package Controllers;

import Init.Init;
import Models.MyException;
import Request.Parameter;
import Response.Response;
import Util.Email;
import Util.MyString;
import Util.Upload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static Init.Init.WebRoot;
import static Init.Init.log4j;

/**
 * Created by karl on 2016/5/31.
 */
@Controller
@RequestMapping(value = "/Resume")
public class Resume {

    @RequestMapping(value = "/Send")
    public void send(HttpServletRequest request, HttpServletResponse response){

        String title = null;
        try {
            String position = Parameter.getDecode(request,"position");
            String name = Parameter.getDecode(request,"name");
            String phone = Parameter.getDecode(request,"phone");
            title = position+"-"+name+"-"+phone;
        } catch (MyException e) {
            Response.fail(response,"decode error");
            log4j.error("resume decode error:"+e.getMessage());
            return;
        }

        String fileName = null;
        try {
            fileName = Upload.springMvcFileUpload(request,response,WebRoot+"/Data/");
        } catch (MyException e) {
            Response.fail(response,"upload error");
            log4j.error("resume upload error:"+e.getMessage());
            return;
        }

        try {
            Email.send("285672259@qq.com","karl.lv@radiumme.com",title,"",WebRoot+"/Data/"+fileName);
        } catch (MyException e) {
            Response.fail(response,"send email error");
            log4j.error("resume send email error:"+e.getMessage());
            return;
        }
        Response.success(response);
        log4j.business("resume send email success:"+fileName);

    }

}

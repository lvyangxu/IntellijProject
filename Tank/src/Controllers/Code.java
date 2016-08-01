package Controllers;

import Models.MyException;
import Models.MyMvcObject;
import Util.Upload;
import org.apache.poi.poifs.poibrowser.Util;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import static Init.Init.WebRoot;

import Util.*;

import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * Created by karl on 2016/7/29.
 */
@Controller
@SessionAttributes("session")
@RequestMapping(value = "/Code")
public class Code {

    @RequestMapping(value = "/Import")
    public void importCode(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        MyMvcObject MyMvcObject1 = new MyMvcObject(request, response, session);
        try {
            String filePath = WebRoot + "Data/code/";
            String fileName = Upload.springMvcFileUpload(request, response, filePath);
            String all = MyFile.read(filePath + fileName, "UTF-8");
            all = all.replace("\r\n", "\n");
            String[] codeArr = new MyString(all).split("\n");
            String sqlCommand = "insert into code values " + Arrays.stream(codeArr).filter(d -> {
                return !d.equals("");
            }).map(d -> {
                String line = "('" + d + "',now(),1)";
                return line;
            }).collect(Collectors.joining(","));
            MyMvcObject1.executeUpdate(sqlCommand).success();
        } catch (MyException e) {
            MyMvcObject1.fail("import failed:" + e.getMessage());
        }

    }

}

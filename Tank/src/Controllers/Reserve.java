package Controllers;

import Dao.Mysql;
import Models.MyException;
import Models.MyMvcObject;
import Util.Http;
import Util.MyString;
import Util.Parameter;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Created by karl on 2016/7/28.
 */
@Controller
@SessionAttributes("session")
@RequestMapping(value = "/Reserve")
public class Reserve {

    @RequestMapping(value = "/Check")
    public void check(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        MyMvcObject MyMvcObject1 = new MyMvcObject(request, response, session);
        String email = Parameter.get(request, "email");
        String recaptcha = Parameter.get(request, "recaptcha");
        try {
            //check recaptcha with google api
            recaptcha = new MyString(recaptcha).base64Decode().toString();
            String param = "secret=6LcYWCcTAAAAABcaGPDjj4duTAquj8do8NkHfVN2&response=" + recaptcha + "&remoteip=" + request.getRemoteAddr();
            String recaptchaResult = Http.post("https://www.google.com/recaptcha/api/siteverify", param);
            JSONObject JSONObject1 = new JSONObject(recaptchaResult);
            Boolean isSuccess = (Boolean) JSONObject1.get("success");
            if (isSuccess == false) {
                MyMvcObject1.fail("recaptcha check failed");
                return;
            }

            email = new MyString(email).base64Decode().toString();
            String sqlCommand = "select * from reserve where email='" + email + "'";
            MyMvcObject1 = MyMvcObject1.executeQuery(sqlCommand);
            Mysql.data data = MyMvcObject1.getMysqlData();
            if (data.rows().size() == 0) {
                //not found,then insert
                sqlCommand = "insert into reserve set email='" + email + "',ip='" + request.getRemoteAddr() +
                        "',createTime=now(),port='"+request.getRemotePort()+"'";
                MyMvcObject1.executeUpdate(sqlCommand).success();
            } else {
                MyMvcObject1.fail("reserved");
            }

        } catch (MyException e) {
            MyMvcObject1.fail(e.getMessage());
        } catch (JSONException e) {
            MyMvcObject1.fail("recaptcha json parse failed");
        }


    }

}

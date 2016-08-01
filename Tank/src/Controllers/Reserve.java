package Controllers;

import Dao.Mysql;
import Models.MyException;
import Models.MyMvcObject;
import Util.MyString;
import Util.Parameter;
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
    public void check(HttpServletRequest request, HttpServletResponse response, HttpSession session){
        MyMvcObject MyMvcObject1 = new MyMvcObject(request,response, session);
        String email = Parameter.get(request,"email");
        try {
            email = new MyString(email).base64Decode().toString();
            String sqlCommand = "select * from reserve where email='"+email+"'";
            MyMvcObject1 = MyMvcObject1.executeQuery(sqlCommand);
            Mysql.data data = MyMvcObject1.getMysqlData();
            if(data.rows().size()==0){
                //not found,then insert
                sqlCommand = "insert into reserve set email='"+email+"',ip='"+request.getRemoteAddr()+"',createTime=now()";
                MyMvcObject1.executeUpdate(sqlCommand).success();
            }else {
                MyMvcObject1.fail("reserved");
            }

        } catch (MyException e) {
            MyMvcObject1.fail(e.getMessage());
        }


    }

}

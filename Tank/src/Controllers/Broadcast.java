package Controllers;

import Dao.Mysql;
import Models.MyException;
import Models.MyMvcObject;
import Util.Email;
import Util.MyString;
import Util.Parameter;
import org.apache.commons.mail.DefaultAuthenticator;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.SimpleEmail;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static Init.Init.log4j;

/**
 * Created by karl on 2016/8/1.
 */
@Controller
@RequestMapping(value = "/Broadcast")
public class Broadcast {

    @RequestMapping(value = "/SendMail")
    public void sendMail(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        MyMvcObject MyMvcObject1 = new MyMvcObject(request, response, session);

        try {
            //get email list
            String paraEmail = Parameter.get(request, "email");
            List<String> emailList = new ArrayList<>();
            if (paraEmail == null) {
                MyMvcObject1 = MyMvcObject1.authenticate().executeQuery("select email from reserve where code is null");
                Mysql.data emailData = MyMvcObject1.getMysqlData();
                emailList = emailData.rows().stream().map(d -> {
                    return d.get(0);
                }).collect(Collectors.toList());
            } else {
                String[] emailArr = new MyString(paraEmail).split(",");
                for (int i = 0; i < emailArr.length; i++) {
                    String email = new MyString(emailArr[i]).base64Decode().toString();
                    emailList.add(email);
                }
            }

            //get reserve code
            MyMvcObject1 = MyMvcObject1.executeQuery("select code from code where valid = 1 limit " + emailList.size());
            Mysql.data codeData = MyMvcObject1.getMysqlData();
            if (codeData.rows().size() < emailList.size()) {
                throw new MyException("lack of reserve code");
            }

            //send email
            List<String> successdEmailList = new ArrayList<>();
            List<String> successCodeList = new ArrayList<>();
            for (int i = 0; i < emailList.size(); i++) {
                String email = emailList.get(i);
                String code = codeData.rows().get(i).get(0);
                String htmlMessage = "Уважаемые командиры,\n" +
                        "\n" +
                        "Наша игра War Machine вышла в свет! Пожалуйста начните ваше чудесное путешествие во времени войны!\n" +
                        "\n" +
                        "Загрузка игры:\n" +
                        "Android：https://play.google.com/store/apps/details?id=com.radiumme.tank.ru\n" +
                        "iOS：https://itunes.apple.com/ru/app/id1142158323\n" +
                        "Код приглашения:" + code + "\n" +
                        "Способ использования: \n" +
                        "Откройте в игру - нажмите ваш аватар - войдите \"настройка\"- найдите \"код приглашения\" -  вводите ваш код\n" +
                        "\n" +
                        "Приятной игры!";
                try {
                    Email Email1 = new Email();
                    String from = "Helpshift@radiumme.com";
                    String password = "Radiumgames123";
                    Email1.send(from, email, "smtp.exmail.qq.com",password , "Танки Империя официально запущен, стоимость упаковки, приглашает Вас испытать", htmlMessage);
                    successdEmailList.add(email);
                    successCodeList.add(code);
                    log4j.business("send email success,code:" + code + ",email:" + email);
                } catch (MyException e) {
                    log4j.business("send email error,code:" + code + ",email:" + email + ",cause:" + e.getMessage());
                }
            }

            String message = "{\"all\":\"" + emailList.size() + "\",\"success\":\"" + successdEmailList.size() + "\"}";

            //update reserve
            if (successdEmailList.size() > 0) {
                List<String> sqlCommandList = new ArrayList<>();
                for (int i = 0; i < successdEmailList.size(); i++) {
                    String email = successdEmailList.get(i);
                    String code = successCodeList.get(i);
                    sqlCommandList.add("update reserve set code = '" + code + "' where email ='" + email + "'");
                }
                MyMvcObject1 = MyMvcObject1.executeBatch(sqlCommandList);
            }

            //update code
            if (successCodeList.size() > 0) {
                String successCodeStr = successCodeList.stream().map(d -> {
                    d = "'" + d + "'";
                    return d;
                }).collect(Collectors.joining(","));
                MyMvcObject1 = MyMvcObject1.executeUpdate("update code set valid = 0 where code in(" + successCodeStr + ")");
            }

            MyMvcObject1.success(message);
        } catch (MyException e) {
            MyMvcObject1.fail(e.getMessage());
        }

    }


}

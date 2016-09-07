package Util;

import Models.MyException;
import org.apache.commons.mail.DefaultAuthenticator;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.SimpleEmail;

/**
 * Created by karl on 2016/8/29.
 */
public class Email {

    public static void send(String from,String to,String smtpServer,String password,String title,String message) throws MyException {
        try {
            doSend(from,to,smtpServer,password,title,message);
        } catch (MyException e) {
            doSend(from,to,smtpServer,password,title,message);
        }
    }

    private static void doSend(String from,String to,String smtpServer,String password,String title,String message) throws MyException {
        try {
            SimpleEmail Email1 = new SimpleEmail();
            Email1.setHostName(smtpServer);
            Email1.setAuthentication(from, password);
            Email1.setFrom(from);
            Email1.setSubject(title);
            Email1.setMsg(message);
            Email1.addTo(to);
            Email1.send();
        } catch (EmailException e) {
            throw new MyException("send email error:"+e.getMessage());
        }
    }

}

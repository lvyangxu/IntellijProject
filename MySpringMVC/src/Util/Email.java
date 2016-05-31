package Util;


import Models.MyException;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;
import java.io.File;
import java.io.UnsupportedEncodingException;

import static Init.Init.WebRoot;


/**
 * Created by karl on 2016/5/31.
 */
public class Email {

    public static void send(String sendTo, String sendFrom, String title, String htmlMessage, String attachmentPath) throws MyException {
        ApplicationContext ApplicationContext1 = null;
        try {
            ApplicationContext1 = new FileSystemXmlApplicationContext(WebRoot + "/WEB-INF/dispatcher-servlet.xml");
        } catch (BeansException e) {
            throw new MyException("load config error:" + e.getMessage());
        }

        JavaMailSender JavaMailSender1 = (JavaMailSender) ApplicationContext1.getBean("mailSender");
        JavaMailSenderImpl JavaMailSenderImpl1 = new JavaMailSenderImpl();
        MimeMessage MimeMessage1 = JavaMailSenderImpl1.createMimeMessage();
        try {
            MimeMessageHelper MimeMessageHelper1 = new MimeMessageHelper(MimeMessage1, true, "GBK");
            MimeMessageHelper1.setTo(sendTo);
            MimeMessageHelper1.setFrom(sendFrom);
            MimeMessageHelper1.setSubject(title);
            MimeMessageHelper1.setText(htmlMessage);
            if (attachmentPath != null) {
                File File1 = new File(attachmentPath);
                MimeMessageHelper1.addAttachment(MimeUtility.encodeWord(File1.getName()), File1);
            }
            JavaMailSender1.send(MimeMessage1);

        } catch (MessagingException e) {
            throw new MyException("send email error:" + e.getMessage());
        } catch (MailException e) {
            throw new MyException("send email error:" + e.getMessage());
        } catch (UnsupportedEncodingException e) {
            throw new MyException("send email error:" + e.getMessage());
        }


    }


}

package Init;

import Util.MyString;
import Util.Mysql;
import Util.Log4j;
import Util.Xml;
import org.dom4j.DocumentException;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.ContextStartedEvent;
import org.springframework.context.event.ContextStoppedEvent;

import java.lang.annotation.*;
import java.sql.SQLException;
import java.util.List;

/**
 * Created by 杨旭 on 2016/4/3.
 */
public class Init implements ApplicationListener<ApplicationEvent> {

    /**
     * listen this application start,refresh,end,stop
     * @param e
     */
    @Override
    public void onApplicationEvent(ApplicationEvent e) {
        if (e instanceof ContextStartedEvent) {
            init();
            log4j.system("应用已开始");
        } else if (e instanceof ContextRefreshedEvent) {
            init();
            log4j.system("应用已刷新");
        } else if (e instanceof ContextStoppedEvent) {
            log4j.system("应用已停止");
        } else if (e instanceof ContextClosedEvent) {
            log4j.system("应用已关闭");
        }
    }

    public static String WebRoot;
    public static Log4j log4j;
    public static String usernameCookieName,passwordCookieName;
    public static Mysql mysql;
    public static String loginRedirectUrl;

    private void init(){

        //web root
        String webAppRootKey = WebAppRootKey.key;
        WebRoot = System.getProperty(webAppRootKey);

        //cookie name
        usernameCookieName = webAppRootKey + "UserName";
        passwordCookieName = webAppRootKey + "Password";

        //log4j
        log4j = new Log4j(WebRoot+"/Config/log4j.xml");

        //login redirect url
        try {
            Xml Xml1 = new Xml(WebRoot+"/Config/redirect.xml");
            loginRedirectUrl = Xml1.readFirstNodeValueByNodeName("url");
        } catch (DocumentException e) {
            log4j.error("get login redirect url failed:xml config load error:"+e.getMessage());
        }

        //mysql
        try {
            Xml Xml1 = new Xml(WebRoot+"/Config/mysql.xml");
            List<String> mysqlConfigList = Xml1.readFirstNodeValueByNodeName(new String[]{"ip","port","database","username","password"});
            String ip = mysqlConfigList.get(0);
            String port = mysqlConfigList.get(1);
            String database = mysqlConfigList.get(2);
            String username = mysqlConfigList.get(3);
            String password = mysqlConfigList.get(4);
            mysql = new Mysql(ip,port,database,username,password);
        } catch (DocumentException e) {
            log4j.error("init mysql failed:xml config load error:"+e.getMessage());
        } catch (SQLException e) {
            log4j.error("init mysql failed:mysql connect error:"+e.getMessage());
        } catch (ClassNotFoundException e) {
            log4j.error("init mysql failed:mysql driver not found:"+e.getMessage());
        }


    }
}

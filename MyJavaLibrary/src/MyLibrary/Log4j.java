package MyLibrary;

import org.apache.log4j.Logger;
import org.apache.log4j.xml.DOMConfigurator;

/**
 * Created by 杨旭 on 2016/4/4.
 */
public class Log4j {

    private Logger systemLogger, databaseLogger, errorLogger, businessLogger, tableLogger, uploadLogger, downloadLogger, loginLogger;
    public Logger system(){
        return this.systemLogger;
    }
    public Logger database(){
        return this.databaseLogger;
    }
    public Logger error(){
        return this.errorLogger;
    }
    public Logger business(){
        return this.businessLogger;
    }
    public Logger table(){
        return this.tableLogger;
    }
    public Logger upload(){
        return this.uploadLogger;
    }
    public Logger download(){
        return this.downloadLogger;
    }
    public Logger login(){
        return this.loginLogger;
    }

    public void initLog4j(String WebRoot) {
        try {
            DOMConfigurator.configure(WebRoot + "/Config/log4j.xml");
            this.systemLogger = Logger.getLogger("system");
            this.databaseLogger = Logger.getLogger("database");
            this.errorLogger = Logger.getLogger("error");
            this.businessLogger = Logger.getLogger("business");
            this.tableLogger = Logger.getLogger("table");
            this.uploadLogger = Logger.getLogger("upload");
            this.downloadLogger = Logger.getLogger("download");
            this.loginLogger = Logger.getLogger("login");

        } catch (Exception e) {
            System.out.println("log4j init failed:" + e.getMessage());
        }

    }

}

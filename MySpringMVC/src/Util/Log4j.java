package Util;

import org.apache.log4j.Logger;
import org.apache.log4j.xml.DOMConfigurator;

/**
 * Created by 杨旭 on 2016/4/4.
 */
public class Log4j {

    private String path;
    public Log4j(String path){
        this.path = path;
        DOMConfigurator.configure(path);
        this.systemLogger = Logger.getLogger("system");
        this.databaseLogger = Logger.getLogger("database");
        this.errorLogger = Logger.getLogger("error");
        this.businessLogger = Logger.getLogger("business");
        this.tableLogger = Logger.getLogger("table");
        this.uploadLogger = Logger.getLogger("upload");
        this.downloadLogger = Logger.getLogger("download");
        this.loginLogger = Logger.getLogger("login");
    }

    private Logger systemLogger, databaseLogger, errorLogger, businessLogger, tableLogger, uploadLogger, downloadLogger, loginLogger;

    public void system(String message) {
        this.systemLogger.info(message);
    }

    public void database(String message) {
        this.databaseLogger.info(message);
    }

    public void error(String message) {
        this.errorLogger.info(message);
    }

    public void business(String message) {
        this.businessLogger.info(message);
    }

    public void table(String message) {
        this.tableLogger.info(message);
    }

    public void upload(String message) {
        this.uploadLogger.info(message);
    }

    public void download(String message) {
        this.downloadLogger.info(message);
    }

    public void login(String message) {
        this.loginLogger.info(message);
    }


}

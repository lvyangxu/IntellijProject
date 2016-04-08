/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyLibrary;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.config.ConfigurationSource;
import org.apache.logging.log4j.core.config.Configurator;

/**
 *
 * @author anshifafeng
 */
public class DoLog4j2 extends HttpServlet {

    /**
     * ��Ĭ��·��WEB-INF/xml/log4j2_simple.xml����log4j2������,����������־,��������ֻ��һ��Appender,����Ϊbusiness
     * @param ServletContext1 ServletContext����
     * @return ʧ�ܷ���null,�ɹ�����Logger���͵�һ������Ϊbusiness��Logger
     */
    public Logger initLog4j2BySimpleAppenderXml(ServletContext ServletContext1) {
        Logger result = null;
        //����log4j2.xml�е�ϵͳ����
        System.setProperty("webAppRootDir", ServletContext1.getRealPath("/"));
        try {
            ConfigurationSource source = new ConfigurationSource(new FileInputStream(ServletContext1.getRealPath("/") + "/WEB-INF/xml/log4j2_simple.xml"));
            Configurator.initialize(null, source);
        } catch (Exception e) {
            return result;
        }
        result = LogManager.getLogger("business");     
        return result;
    }
 
    /**
     * ��Ĭ��·��WEB-INF/xml/log4j2_multiple.xml����log4j2������,����������־,����������4��Appender,���Ʒֱ�Ϊsystem��database��error��business
     * @param ServletContext1 ServletContext����
     * @return ʧ�ܷ���null,�ɹ�����Logger�����͵�List,Logger��Ӧ��Appender���Ʒֱ�Ϊsystem��database��error��business
     */
    public List<Logger> initLog4j2ByMultipleAppenderXml(ServletContext ServletContext1) {
        List<Logger> result = new ArrayList<>();
        List<String> loggerNameArray = new ArrayList<>();
        loggerNameArray.add("system");
        loggerNameArray.add("database");
        loggerNameArray.add("error");
        loggerNameArray.add("business");
        
        //����log4j2.xml�е�ϵͳ����
        System.setProperty("webAppRootDir", ServletContext1.getRealPath("/"));
        try {
            ConfigurationSource source = new ConfigurationSource(new FileInputStream(ServletContext1.getRealPath("/") + "/WEB-INF/xml/log4j2_multiple.xml"));
            Configurator.initialize(null, source);
        } catch (Exception e) {
            result = null;
            return result;
        }

        for (String loggerName : loggerNameArray) {
            result.add(LogManager.getLogger(loggerName));
        }
        return result;
    }

    /**
     * ��Ĭ��·��WEB-INF/xml/log4j2.xml�����Զ����log4j2������,����������־
     * @param ServletContext1 ServletContext����
     * @param loggerNameArray logger���Ƶ��ַ�������
     * @return ʧ�ܷ���null,�ɹ�����Logger�����͵�List,Logger��Ӧ��Appender���ƺͲ���loggerNameArray��˳��һ��
     */
    public List<Logger> initLog4j2ByCustomAppenderXml(ServletContext ServletContext1, String[] loggerNameArray) {
        List<Logger> result = new ArrayList<>();

        //����log4j2.xml�е�ϵͳ����
        System.setProperty("webAppRootDir", ServletContext1.getRealPath("/"));
        try {
            ConfigurationSource source = new ConfigurationSource(new FileInputStream(ServletContext1.getRealPath("/") + "/WEB-INF/xml/log4j2.xml"));
            Configurator.initialize(null, source);
        } catch (Exception e) {
            result = null;
            return result;
        }

        for (String loggerName : loggerNameArray) {
            result.add(LogManager.getLogger(loggerName));
        }
        return result;
    }
}

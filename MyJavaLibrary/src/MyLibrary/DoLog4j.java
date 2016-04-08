/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyLibrary;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletContext;

import org.apache.log4j.Logger;
import org.apache.log4j.xml.DOMConfigurator;


/**
 *
 * @author anshifafeng
 */
public class DoLog4j {
    /**
     * ��Ĭ��·��WEB-INF/xml/log4j_simple.xml����log4j������,����������־,��������ֻ��һ��Appender,����Ϊbusiness
     *
     * @param ServletContext1 ServletContext����
     * @return ʧ�ܷ���null,�ɹ�����Logger���͵�һ������Ϊbusiness��Logger
     */
    public Logger initLog4jBySimpleAppenderXml(ServletContext ServletContext1) {
        Logger result = null;
        //����log4j.xml�е�ϵͳ����
        System.setProperty("webAppRootDir", ServletContext1.getRealPath("/"));
        try {
            DOMConfigurator.configure(ServletContext1.getRealPath("/") + "/WEB-INF/xml/log4j_simple.xml");
        } catch (Exception e) {
            return result;
        }        
        result = Logger.getLogger("business");    
        return result;
    }
 
    /**
     * ��Ĭ��·��WEB-INF/xml/log4j_multiple.xml����log4j������,����������־,����������4��Appender,���Ʒֱ�Ϊsystem��database��error��business
     * @param ServletContext1 ServletContext����
     * @return ʧ�ܷ���null,�ɹ�����Logger�����͵�List,Logger��Ӧ��Appender���Ʒֱ�Ϊsystem��database��error��business
     */
    public List<Logger> initLog4jByMultipleAppenderXml(ServletContext ServletContext1) {
        List<Logger> result = new ArrayList<>();
        List<String> loggerNameArray = new ArrayList<>();
        loggerNameArray.add("system");
        loggerNameArray.add("database");
        loggerNameArray.add("error");
        loggerNameArray.add("business"); 

        //����log4j.xml�е�ϵͳ����
        System.setProperty("webAppRootDir", ServletContext1.getRealPath("/"));
        try {
            DOMConfigurator.configure(ServletContext1.getRealPath("/") + "/WEB-INF/xml/log4j_multiple.xml");
        } catch (Exception e) {
            result = null;
            return result;
        }

        for (String loggerName : loggerNameArray) {
            result.add(Logger.getLogger(loggerName));
        }
        return result;
    }

    /**
     * ��Ĭ��·��WEB-INF/xml/log4j.xml�����Զ����log4j������,����������־
     *
     * @param ServletContext1 ServletContext����
     * @param loggerNameArray logger���Ƶ��ַ�������
     * @return
     * ʧ�ܷ���null,�ɹ�����Logger�����͵�List,Logger��Ӧ��Appender���ƺͲ���loggerNameArray��˳��һ��
     */
    public List<Logger> initLog4jByCustomAppenderXml(ServletContext ServletContext1, String[] loggerNameArray) {
        List<Logger> result = new ArrayList<>();

        //����log4j2.xml�е�ϵͳ����
        System.setProperty("webAppRootDir", ServletContext1.getRealPath("/"));
        try { 
            DOMConfigurator.configure(ServletContext1.getRealPath("/") + "/WEB-INF/xml/log4j.xml");
        } catch (Exception e) {
            result = null;
            return result;
        }

        for (String loggerName : loggerNameArray) {
            result.add(Logger.getLogger(loggerName));
        }
        return result;
    }
    
    /**
     * ��Ĭ��·��WEB-INF/xml/log4j_simple.xml����log4j������,����������־,��������ֻ��һ��Appender,����Ϊbusiness
     *
     * @param webRootDirKey web��Ŀ��·����ϵͳ��������
     * @return ʧ�ܷ���null,�ɹ�����Logger���͵�һ������Ϊbusiness��Logger
     */
    public Logger initLog4jBySimpleAppenderXml(String webRootDirKey) {
        Logger result = null;
        //��ȡϵͳ����
        String webRootPath = System.getProperty(webRootDirKey);
        try {
            DOMConfigurator.configure(webRootPath + "/WEB-INF/MyConfig/log4j_simple.xml");
        } catch (Exception e) {
            return result;
        }        
        result = Logger.getLogger("business");    
        return result;
    }
 
    /**
     * ��Ĭ��·��WEB-INF/xml/log4j_multiple.xml����log4j������,����������־,����������4��Appender,���Ʒֱ�Ϊsystem��database��error��business
     *
     * @param webRootDirKey web��Ŀ��·����ϵͳ��������
     * @return
     * ʧ�ܷ���null,�ɹ�����Logger�����͵�List,Logger��Ӧ��Appender���Ʒֱ�Ϊsystem��database��error��business
     */
    public List<Logger> initLog4jByMultipleAppenderXml(String webRootDirKey) {
        List<Logger> result = new ArrayList<>();
        List<String> loggerNameArray = new ArrayList<>();
        loggerNameArray.add("system");
        loggerNameArray.add("database");
        loggerNameArray.add("error");
        loggerNameArray.add("business"); 

        //��ȡϵͳ����
        String webRootPath = System.getProperty(webRootDirKey);
        try {
            DOMConfigurator.configure(webRootPath + "/WEB-INF/MyConfig/log4j_multiple.xml");
        } catch (Exception e) {
            result = null;
            return result;
        }

        for (String loggerName : loggerNameArray) {
            result.add(Logger.getLogger(loggerName));
        }
        return result;
    }

    /**
     * ��Ĭ��·��WEB-INF/xml/log4j.xml�����Զ����log4j������,����������־
     *
     * @param loggerNameArray logger���Ƶ��ַ�������
     * @param webRootDirKey web��Ŀ��·����ϵͳ��������
     * @return
     * ʧ�ܷ���null,�ɹ�����Logger�����͵�List,Logger��Ӧ��Appender���ƺͲ���loggerNameArray��˳��һ��
     */
    public List<Logger> initLog4jByCustomAppenderXml(String[] loggerNameArray,String webRootDirKey) {
        List<Logger> result = new ArrayList<>();

        //��ȡϵͳ����
        String webRootPath = System.getProperty(webRootDirKey);
        try { 
            DOMConfigurator.configure(webRootPath + "/WEB-INF/MyConfig/log4j.xml");
        } catch (Exception e) {
            result = null;
            return result;
        }

        for (String loggerName : loggerNameArray) {
            result.add(Logger.getLogger(loggerName));
        }
        return result;
    }
}

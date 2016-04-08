package Init;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.ContextStartedEvent;
import org.springframework.context.event.ContextStoppedEvent;
import MyLibrary.*;

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
            applicationStartOrRefresh();
            if (log4j.system() != null) {
                log4j.system().info("应用已开始");
            }
        } else if (e instanceof ContextRefreshedEvent) {
            applicationStartOrRefresh();
            if (log4j.system() != null) {
                log4j.login().info("应用已刷新");
            }
        } else if (e instanceof ContextStoppedEvent) {
            if (log4j.system() != null) {
                log4j.system().info("应用已停止");
            }
        } else if (e instanceof ContextClosedEvent) {
            if (log4j.system() != null) {
                log4j.system().info("应用已关闭");
            }
        }
    }

    public static String WebRoot;
    public static Log4j log4j = new Log4j();

    private void applicationStartOrRefresh(){
        //log4j
        WebRoot = System.getProperty("webapp.root");
        System.setProperty("WebRoot", WebRoot);
        log4j.initLog4j(WebRoot);
    }
}

package Response;

import Util.Log4j;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

import static Init.Init.log4j;

/**
 * Created by karl on 2016/4/20.
 */
public class Response {

    private static void response(HttpServletResponse response, String message)  {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter PrintWriter1 = null;
        try {
            PrintWriter1 = response.getWriter();
        } catch (IOException e) {
            log4j.error("response client failed:"+e.getMessage());
        }
        PrintWriter1.print(message);
        PrintWriter1.flush();
        PrintWriter1.close();
    }

    public static void success(HttpServletResponse response,String ...responseMessage) {
        String message = "";
        if(responseMessage.length!=0){
            message = responseMessage[0];
        }
        message = "{\"success\":\"true\",\"message\":\""+message+"\"}";
        response(response,message);
    }

    public static void fail(HttpServletResponse response,String message)  {
        message = "{\"success\":\"false\",\"message\":\""+message+"\"}";
        response(response,message);
    }

}

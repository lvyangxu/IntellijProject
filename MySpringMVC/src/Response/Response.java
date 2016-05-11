package Response;

import Models.MyException;
import Util.Log4j;

import javax.servlet.http.HttpServletResponse;
import java.io.*;

import static Init.Init.log4j;

/**
 * Created by karl on 2016/4/20.
 */
public class Response {

    /**
     * response string message
     * @param response
     * @param message
     */
    private static void response(HttpServletResponse response, String message) {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter PrintWriter1 = null;
        try {
            PrintWriter1 = response.getWriter();
        } catch (IOException e) {
            log4j.error("response client failed:" + e.getMessage());
        }
        PrintWriter1.print(message);
        PrintWriter1.flush();
        PrintWriter1.close();
    }

    /**
     * response success json string message
     * @param response
     * @param responseMessage
     */
    public static void success(HttpServletResponse response, String... responseMessage) {
        String message = "";
        if (responseMessage.length != 0) {
            message = responseMessage[0];
        }
        if ((message.startsWith("{") && message.endsWith("}"))||(message.startsWith("[") && message.endsWith("]"))) {
            message = "{\"success\":\"true\",\"message\":" + message + "}";
        } else {
            message = "{\"success\":\"true\",\"message\":\"" + message + "\"}";
        }

        response(response, message);
    }

    /**
     * response fail json string message
     * @param response
     * @param message
     */
    public static void fail(HttpServletResponse response, String message) {
        message = "{\"success\":\"false\",\"message\":\"" + message + "\"}";
        response(response, message);
    }

    public static void file(HttpServletResponse response,String filePath,String fileName) throws MyException {
        response.setHeader("Content-type", "APPLICATION/OCTET-STREAM");
        try {
            response.setHeader("Content-Disposition", "attachment;fileName=" + java.net.URLEncoder.encode(fileName, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            throw new MyException("unSupportEncoding");
        }
        response.setCharacterEncoding("UTF-8");
        try {
            try (InputStream inputStream = new FileInputStream(new File(filePath+fileName))) {
                OutputStream os = new BufferedOutputStream(response.getOutputStream());
                byte[] b = new byte[2048];
                int length;
                while ((length = inputStream.read(b)) > 0) {
                    os.write(b, 0, length);
                }
                os.flush();
                os.close();
            }
        } catch (IOException e) {
            throw new MyException("file io excetion");
        }

    }
}

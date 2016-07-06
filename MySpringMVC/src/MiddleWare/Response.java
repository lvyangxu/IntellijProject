package MiddleWare;

import Models.MyException;
import Util.Log4j;
import Util.MyString;
import Util.Parameter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

import static Init.Init.WebRoot;
import static Init.Init.log4j;

/**
 * Created by karl on 2016/4/20.
 */
public class Response {

    /**
     * response string message
     *
     * @param response
     * @param message
     */
    private static void response(HttpServletResponse response, String message) {
        response(response, message, 200);
    }

    /**
     * response string message with httpStatusCode
     *
     * @param response
     * @param message
     * @param statusCode
     */
    private static void response(HttpServletResponse response, String message, Integer httpStatusCode) {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(httpStatusCode);
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
     *
     * @param response
     * @param responseMessage
     */
    public static void success(HttpServletResponse response, String... responseMessage) {
        String message = "";
        if (responseMessage.length != 0) {
            message = responseMessage[0];
        }
        if ((message.startsWith("{") && message.endsWith("}")) || (message.startsWith("[") && message.endsWith("]"))) {
            message = "{\"success\":\"true\",\"message\":" + message + "}";
        } else {
            message = "{\"success\":\"true\",\"message\":\"" + message + "\"}";
        }

        response(response, message);
    }

    /**
     * response fail json string message
     *
     * @param response
     * @param message
     */
    public static void fail(HttpServletResponse response, String message) {
        message = "{\"success\":\"false\",\"message\":\"" + message + "\"}";
        response(response, message);
    }

    /**
     * response unauthorized width 401 http status code
     *
     * @param response
     */
    public static void unauthorized(HttpServletResponse response) {
        response(response, "authenticate failed", 401);
    }


    public static void excel(HttpServletRequest request, HttpServletResponse response, String table) throws MyException {

        String filePath = "Data/" + table + "/";
        filePath = WebRoot + filePath;
        String fileName = Parameter.get(request,"fileName");
        fileName = new MyString(fileName).base64Decode().toString();
        fileName += ".xlsx";

        response.setHeader("Content-type", "APPLICATION/OCTET-STREAM");
        try {
            response.setHeader("Content-Disposition", "attachment;fileName=" + java.net.URLEncoder.encode(fileName, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            throw new MyException("unSupportEncoding");
        }
        response.setCharacterEncoding("UTF-8");
        try {
            try (InputStream inputStream = new FileInputStream(new File(filePath + fileName))) {
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

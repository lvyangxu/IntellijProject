package Models;

/**
 * Created by karl on 2016/4/19.
 */
public class MyException extends java.lang.Exception {

    private String message;

    public MyException(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public String getJsonMessage(){
        String result = "{\"success\":\"false\",\"message\":\""+this.message+"\"";
        return result;
    }
}

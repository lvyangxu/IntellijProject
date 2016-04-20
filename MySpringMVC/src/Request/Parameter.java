package Request;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by karl on 2016/4/20.
 */
public class Parameter {

    public static String get(HttpServletRequest request,String name){
        String result = request.getParameter(name);
        return result;
    }
}

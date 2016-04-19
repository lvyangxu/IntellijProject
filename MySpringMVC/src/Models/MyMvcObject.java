package Models;

import org.springframework.ui.Model;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created by karl on 2016/4/19.
 */
public class MyMvcObject{

    private HttpServletRequest request;
    private HttpSession session;
    private MyMvcObject This;
    public MyMvcObject(HttpServletRequest request, HttpSession session){
        this.request = request;
        this.session = session;
        This = this;
    }

//    public class Account{
//         public void login(){
//
//         }
//    }





}

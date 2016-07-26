package MiddleWare;

import Init.Init;
import Models.MyException;
import Util.MyFile;
import Util.Path;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Created by karl on 2016/7/1.
 */
public class Callback {

    public static void login(HttpServletRequest request, HttpServletResponse response, HttpSession session){

    }

    public static void attachmentUpload(HttpServletRequest request, HttpServletResponse response, HttpSession session,String table,String path,String fileName){
        try {
            Path.create(Init.WebRoot+"Images/"+table+"/");
            MyFile.copy(path+fileName, Init.WebRoot+"Images/"+table+"/"+fileName);
        } catch (MyException e) {
            e.printStackTrace();
        }
    }

}

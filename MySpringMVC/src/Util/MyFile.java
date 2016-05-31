package Util;

import Models.MyException;

/**
 * Created by karl on 2016/5/31.
 */
public class MyFile {

    public static void delete(String filePath) throws MyException {
        java.io.File File1 = new java.io.File(filePath);
        if(File1.isDirectory()){
            throw new MyException("filePath is directory");
        }
        if(File1.exists()){
            boolean isDelete = File1.delete();
            if(!isDelete){
                throw new MyException("delete file failed");
            }
        }


    }
}

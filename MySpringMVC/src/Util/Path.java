package Util;

import Models.MyException;

import java.io.File;
import java.util.List;

/**
 * Created by karl on 2016/5/12.
 */
public class Path {

    public static void create(String folderDir) throws MyException {
        File File1 = new File(folderDir);
        if (!File1.exists()) {
            Boolean isCreated = File1.mkdirs();
            if (!isCreated) {
                throw new MyException("createDirFailed");
            }
        }
    }

    public static String[] getFileNameList(String folderDir) throws MyException {
        File File1 = new File(folderDir);
        if(!File1.exists()){
            throw new MyException("the directory is not exist");
        }
        String[] arr = File1.list();
        return arr;
    }

}

package Util;

import Models.MyException;
import org.springframework.util.FileCopyUtils;

import java.io.File;
import java.io.IOException;

/**
 * Created by karl on 2016/5/31.
 */
public class MyFile {

    public static void delete(String filePath) throws MyException {
        File File1 = new File(filePath);
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

    public static void copy(String filePath,String outPath) throws MyException {
        File File1 = new File(filePath);
        File File2 = new File(outPath);
        try {
            FileCopyUtils.copy(File1,File2);
        } catch (IOException e) {
            throw new MyException("io exception:"+e.getMessage());
        }
    }
}

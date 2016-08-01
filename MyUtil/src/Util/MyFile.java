package Util;

import Models.MyException;

import java.io.*;

/**
 * Created by karl on 2016/7/29.
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

    public static String read(String filePath, String encode) throws MyException {
        if (filePath == null || filePath.equals("")) {
            throw new MyException("file path is invalid");
        }
        StringBuilder StringBuilder1 = new StringBuilder();
        java.io.File File1 = new java.io.File(filePath);
        try (InputStreamReader   InputStreamReader1 = new InputStreamReader(new FileInputStream(File1), encode);){
            BufferedReader  BufferedReader1 = new BufferedReader(InputStreamReader1);
            int ch = 0;
            while ((ch = BufferedReader1.read()) != -1) {
                StringBuilder1.append((char) ch);
            }
        } catch (UnsupportedEncodingException e) {
            throw new MyException("encoding is invalid");
        } catch (FileNotFoundException e) {
            throw new MyException("file not found:"+e.getMessage());
        } catch (IOException e) {
            throw new MyException("io exception:"+e.getMessage());
        }
        return StringBuilder1.toString();
    }

}

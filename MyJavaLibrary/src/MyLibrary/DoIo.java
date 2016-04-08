/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyLibrary;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;

/**
 *
 * @author anshifafeng
 */
public class DoIo {

    /**
     * 使锟斤拷指锟斤拷锟斤拷锟斤拷锟饺≈革拷锟轿伙拷玫锟斤拷募锟�
     * @param filePath 锟侥硷拷锟斤拷锟斤拷位锟斤拷
     * @param encode 锟斤拷锟斤拷锟斤拷锟�,锟斤拷锟斤拷"UTF-8"
     * @return 锟斤拷锟斤拷String[]锟斤拷锟斤拷锟斤拷,元锟截分憋拷为锟侥硷拷锟斤拷锟捷猴拷锟届常锟斤拷息
     */
    public String[] readTextFromFile(String filePath, String encode) {
        String[] result = new String[]{null, null};
        if (filePath == null || filePath.equals("")) {
            result[1] = "nullFilePath";
            return result;
        }
        StringBuilder StringBuilder1 = new StringBuilder();
        InputStreamReader InputStreamReader1 = null;
        BufferedReader BufferedReader1 = null;
        try {
            File File1 = new File(filePath);
            InputStreamReader1 = new InputStreamReader(new FileInputStream(File1), encode);
            BufferedReader1 = new BufferedReader(InputStreamReader1);
            
            int ch = 0;
            while ((ch = BufferedReader1.read()) != -1) {
                StringBuilder1.append((char) ch);
            }
        } catch (Exception e) {
            result[1] = e.getMessage();
        } finally {
            if (InputStreamReader1 != null) {
                try {
                    InputStreamReader1.close();
                } catch (Exception e1) {
                }
            }
            if(BufferedReader1!=null){
                try {
                    BufferedReader1.close();
                } catch (Exception e1) {
                }            
            }
            
        } 
        result[0] = StringBuilder1.toString();
        return result;

    }
    
    /**
     * 使锟斤拷指锟斤拷锟斤拷锟诫将指锟斤拷锟斤拷锟斤拷写锟诫到指锟斤拷锟侥硷拷,锟斤拷锟斤拷募锟斤拷锟侥柯硷拷锟斤拷锟斤拷锟�,锟斤拷锟斤拷锟斤拷锟斤拷
     * @param fileDir 锟侥硷拷锟斤拷锟斤拷目录
     * @param fileName 锟侥硷拷锟斤拷锟�
     * @param encode 锟斤拷锟斤拷锟斤拷锟�,锟斤拷锟斤拷"UTF-8"
     * @param content 要写锟斤拷锟斤拷址锟斤拷锟斤拷锟�
     * @return 锟缴癸拷锟斤拷锟斤拷null,失锟杰凤拷锟斤拷String锟斤拷锟酵碉拷锟届常锟斤拷息
     */
    public String createTextFile(String fileDir,String fileName, String encode,String content){
        String result = null;
        String filePath = fileDir + "/" + fileName;
        if (filePath == null || filePath.equals("")) {
            result = "nullFilePath";
            return result;
        }
        
        String createDirResult = createFolder(fileDir);
        if(createDirResult!=null){
            result = createDirResult;
            return result;       
        }
        
        FileOutputStream FileOutputStream1=null;
        BufferedWriter BufferedWriter1 = null;
        OutputStreamWriter OutputStreamWriter1 = null;
        try {
            FileOutputStream1 = new FileOutputStream(filePath);
            OutputStreamWriter1 = new OutputStreamWriter(FileOutputStream1,encode);
            BufferedWriter1 = new BufferedWriter(OutputStreamWriter1);
            BufferedWriter1.write(content);
            BufferedWriter1.flush();
        } catch (Exception e) {
            result = e.getMessage();
            return result;
        } finally {
            if (FileOutputStream1 != null) {
                try {
                    FileOutputStream1.close();
                } catch (Exception e1) {
                }
            }
            if(BufferedWriter1!=null){
                try {
                    BufferedWriter1.close();
                } catch (Exception e1) {
                }            
            }
            if(OutputStreamWriter1!=null){
                try {
                    OutputStreamWriter1.close();
                } catch (Exception e1) {
                }            
            }            
        }
        return result;
    }
    
    /**
     * 创建目录
     * @param folderDir
     * @return 成功返回null,失败返回异常信息
     */
    public String createFolder(String folderDir){
        String result = null;
        try {
            File File1 = new File(folderDir);
            if (!File1.exists()) {
                Boolean isCreated = File1.mkdirs();
                if (!isCreated) {
                    result = "createDirFailed";
                }
            }            
        } catch (Exception e) {
            result = e.getMessage();
        }
        return result;
    }
    
    /**
     * 鍒犻櫎鏂囦欢鎴栫洰褰�
     * @param filePath 鏂囦欢鍏ㄨ矾寰�
     * @return 鎴愬姛杩斿洖null,澶辫触杩斿洖寮傚父淇℃伅
     */
    public String deleteFileOrDirectory(String filePath){
        String result = null;
        try {
            File File1 = new File(filePath);
            if (File1.exists()) {
                //鍒ゆ柇鏄惁鏄洰褰�
                if(File1.isDirectory()){
                    String[] childFileArray = File1.list();
                    //閫掑綊鍒犻櫎
                    for (String childFilePath : childFileArray) {
                        String childDeleteResult = deleteFileOrDirectory(filePath+"/"+childFilePath);
                        if (childDeleteResult != null) {
                            return childDeleteResult;
                        }
                    }
                }
                
                //执鍒ゆ柇鏄惁鍒犻櫎鎴愬姛
                Boolean isDeleted = File1.delete();
                if (!isDeleted) {
                    result = "deleteDirFailed";
                }
            }
        } catch (Exception e) {
            result = e.getMessage();
        }
        return result;   
    }

    /**
     * 锟斤拷取指锟斤拷目录锟铰碉拷锟侥硷拷锟叫�?锟斤拷锟斤拷目录锟叫碉拷锟侥硷拷
     * @param folderDir 锟侥硷拷目录
     * @return 锟斤拷锟斤拷一锟斤拷list锟斤拷元锟斤拷为锟侥硷拷全路锟斤拷
     */
    public List<String> getDirectoryFileList(String folderDir){
        List<String> result = new ArrayList<>();
        File File1 = new File(folderDir);
        String[] childFileArray = File1.list();
        if (childFileArray == null) {
            return result;
        }        
        for (String childFileStr : childFileArray){
            String childPath = folderDir+"/"+childFileStr;
            File childFile = new File(childPath);
            if (childFile.isFile()) {
                result.add(childPath);
            }
            if(childFile.isDirectory()){
                result.addAll(getDirectoryFileList(childPath));
            }            
        }
        return result;
    }

    /**
     * 锟斤拷取指锟斤拷目录锟铰碉拷锟侥硷拷锟斤拷锟叫憋拷(锟斤拷锟斤拷锟侥硷拷锟揭诧拷锟斤拷锟斤拷目录)
     * @param folderDir 锟侥硷拷目录
     * @return 锟斤拷锟斤拷一锟斤拷list锟斤拷元锟斤拷为锟斤拷锟侥硷拷锟斤拷锟斤拷锟�
     */
    public List<String> getOnlycChildDirectoryList(String folderDir){
        List<String> result = new ArrayList<>();
        File File1 = new File(folderDir);
        String[] childFileArray = File1.list();
        if (childFileArray == null) {
            return result;
        }        
        for (String childFileStr : childFileArray){
            String childPath = folderDir+"/"+childFileStr;
            File childFile = new File(childPath);
            if (childFile.isFile()) {
                continue;
            }
            if(childFile.isDirectory()){
                result.add(childFileStr);
            }            
        }
        return result;
    }

    /**
     * 锟皆讹拷锟斤拷锟狡凤拷式锟斤拷远锟斤拷url锟斤拷锟斤拷锟侥硷拷
     * @param urlString 锟侥硷拷锟斤拷url锟斤拷址
     * @param filePath 锟侥硷拷锟斤拷锟节碉拷锟侥硷拷锟斤拷
     * @param fileName 锟侥硷拷锟斤拷
     * @throws Exception 锟斤拷锟斤拷失锟斤拷锟斤拷锟阶筹拷锟届常
     */
    public void doDownloadFile(String urlString,String filePath,String fileName) throws Exception{
        createFolder(filePath);
        URL URL1 = new URL(urlString);
        FileUtils.copyURLToFile(URL1, new File(filePath+fileName)); 
    }      
    
    
    
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyLibrary;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;

/**
 *
 * @author anshifafeng
 */
public class DoRuntime {
    
    /**
     * �����ⲿ����,����ȡ�����mysql���ݲ����ļ���ֱ�Ӵ�InputStream��ȡ���ݴ�Ϊ�����ļ���
     * @param command Ҫִ�е�����
     * @return ����String���͵�����,����Ԫ�طֱ�Ϊ�ⲿ���������InputStream��ErrorStream���쳣��Ϣ
     */
    public String[] DoRuntimeCommand(String command){
        String[] result = new String[]{null,null};
        
        Runtime Runtime1 = Runtime.getRuntime();
        InputStream InputStream1 = null;
        InputStreamReader InputStreamReader1 = null;
        BufferedReader BufferedReader1 = null;
        try {
           Process Process1 = Runtime1.exec(command);
           
           //��ȡ���������InputStream
           StringBuilder StringBuilder1 = new StringBuilder();
           InputStream1=Process1.getInputStream();           
           InputStreamReader1 = new InputStreamReader(InputStream1);
            BufferedReader1 = new BufferedReader(InputStreamReader1);            
            int ch = 0;
            while ((ch = BufferedReader1.read()) != -1) {
                StringBuilder1.append((char) ch);
            }
            result[0] = StringBuilder1.toString();
                        
            //��ȡ���������ErrorStream
           StringBuilder StringBuilder2 = new StringBuilder();
           InputStream1=Process1.getErrorStream();           
           InputStreamReader1 = new InputStreamReader(InputStream1);
            BufferedReader1 = new BufferedReader(InputStreamReader1);            
            ch = 0;
            while ((ch = BufferedReader1.read()) != -1) {
                StringBuilder2.append((char) ch);
            }            
            result[1] = StringBuilder2.toString();
            
        } catch (Exception e) {
            result[1] = e.getMessage();
        }finally{
            if(InputStream1!=null){
                try {
                    InputStream1.close();
                } catch (Exception e) {
                }
            }
            if(InputStreamReader1!=null){
                try {
                    InputStreamReader1.close();
                } catch (Exception e) {
                }
            }
            if(BufferedReader1!=null){
                try {
                    BufferedReader1.close();
                } catch (Exception e) {
                }
            }            
        }
        
        return result;
    }
    
        /**
     * �����ⲿ����,����ȡ�����mysql���벻���ļ���ֱ�Ӵ�OutputStream���Ҫ�����sql���ݣ�
     * @param command Ҫִ�е�����
     * @param OutputString ����������ַ���
     * @return ����String���͵��쳣��Ϣ,�ɹ�����null
     */
    public String DoRuntimeCommand(String command,String OutputString,String encode){
        String result =null;
        
        Runtime Runtime1 = Runtime.getRuntime();
        OutputStream OutputStream1 = null;
        OutputStreamWriter OutputStreamWriter1 = null;
        try {
           Process Process1 = Runtime1.exec(command);
                      
            //��ȡ���������OutputStream
            OutputStream1 = Process1.getOutputStream();
            OutputStreamWriter1 = new OutputStreamWriter(OutputStream1, encode);
            OutputStreamWriter1.write(OutputString); 
            OutputStreamWriter1.flush();
            
        } catch (Exception e) {
            result = e.getMessage();
        }finally{     
            if(OutputStream1!=null){
                try {
                    OutputStream1.close();
                } catch (Exception e) {
                }
            }     
            if(OutputStreamWriter1!=null){
                try {
                    OutputStreamWriter1.close();
                } catch (Exception e) {
                }
            }                 
        }
        
        return result;
    }
}

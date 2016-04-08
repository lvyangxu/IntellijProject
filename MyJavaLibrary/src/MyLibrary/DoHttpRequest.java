/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyLibrary;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

public class DoHttpRequest {
    
    /**
     * http get with header
     * @param urlString urlַ
     * @param encode charset
     * @param headerKeyList list of headerKey
     * @param headerValueList list of headerValue
     * @return http response
     * @throws Exception
     */
    public String doGet(String urlString,String encode,List<String> headerKeyList,List<String> headerValueList) throws Exception{
        StringBuilder StringBuilder1 = new StringBuilder();
        URL URL1 = new URL(urlString);
        HttpURLConnection HttpURLConnection1 = (HttpURLConnection) URL1.openConnection();     
		if (headerKeyList != null && headerValueList != null) {
			for (int i = 0; i < headerKeyList.size(); i++) {
				HttpURLConnection1.addRequestProperty(headerKeyList.get(i), headerValueList.get(i));
			}
		}        
        HttpURLConnection1.connect();
        try (InputStreamReader InputStreamReader1 = new InputStreamReader(HttpURLConnection1.getInputStream(), encode); BufferedReader BufferedReader1 = new BufferedReader(InputStreamReader1)) {
            int ch = 0;
            while ((ch = BufferedReader1.read()) != -1) {
                StringBuilder1.append((char) ch);
            }
        }
        HttpURLConnection1.disconnect();
        return StringBuilder1.toString();
    }
 
    /**
     * http get without header
     * @param urlString urlַ
     * @param encode charset
     * @return http response
     * @throws Exception
     */
    public String doGet(String urlString,String encode) throws Exception{
    	String result = doGet(urlString,encode,null,null);
    	return result;
    }

    /**
     * http get with maxTryTimes with header
     * @param urlString url
     * @param encode charset
     * @param maxTryTimes try times
     * @param headerKeyList list of headerKey
     * @param headerValueList list of headerValue
     * @return http response
     * @throws Exception
     */
    public String doGet(String urlString,String encode,int maxTryTimes,List<String> headerKeyList,List<String> headerValueList) throws Exception{
        String result = null;
        while (maxTryTimes >= 1) {
            try {
                result = doGet(urlString, encode,headerKeyList,headerValueList);
                break;
            } catch (Exception e) {
                if (maxTryTimes == 1) {
                    throw e;
                }
            }            
            maxTryTimes = maxTryTimes -1;
        }
        return result;
    }

    /**
     * http get with maxTryTimes without header
     * @param urlString url
     * @param encode charset
     * @param maxTryTimes try times
     * @return http response
     * @throws Exception
     */
    public String doGet(String urlString,String encode,int maxTryTimes) throws Exception{
        String result = doGet(urlString,encode,maxTryTimes,null,null);
        return result;
    }
    
    
    /**
     * http post with header
     * @param urlString urlַ
     * @param encode charset
     * @param paramString string of param
     * @param headerKeyList list of headerKey
     * @param headerValueList list of headerValue
     * @return http response
     * @throws Exception excetion
     */
    public String doPost(String urlString,String encode,String paramString,List<String> headerKeyList,List<String> headerValueList) throws Exception {
		String result = null;
		StringBuilder StringBuilder1 = new StringBuilder();
		
		URL URL1 = new URL(urlString);
		HttpURLConnection HttpURLConnection1 = (HttpURLConnection) URL1.openConnection();

		HttpURLConnection1.setDoOutput(true);
		HttpURLConnection1.setDoInput(true);
		HttpURLConnection1.setRequestMethod("POST");
		if (headerKeyList != null && headerValueList != null) {
			for (int i = 0; i < headerKeyList.size(); i++) {
				HttpURLConnection1.addRequestProperty(headerKeyList.get(i), headerValueList.get(i));
			}
		}
		
		try (OutputStreamWriter OutputStreamWriter1 = new OutputStreamWriter(HttpURLConnection1.getOutputStream(), encode)) {
			OutputStreamWriter1.write(paramString);
			OutputStreamWriter1.flush();
			HttpURLConnection1.connect();
			InputStream InputStream1 = HttpURLConnection1.getInputStream();
			try(InputStreamReader InputStreamReader1 = new InputStreamReader(InputStream1);BufferedReader BufferedReader1 = new BufferedReader(InputStreamReader1)){
				int ch = 0;
				while ((ch = BufferedReader1.read()) != -1) {
					StringBuilder1.append((char) ch);
				}
				result = StringBuilder1.toString();				
			}
		}				
		HttpURLConnection1.disconnect();
		return result;
    }
 
    /**
     * http post without header
     * @param urlString urlַ
     * @param encode charset
     * @param paramString string of param
     * @return http response
     * @throws Exception excetion
     */
    public String doPost(String urlString,String encode,String paramString) throws Exception {
		String result = doPost(urlString,encode,paramString,null,null);
		return result;
    }
    
    /**
     * http post with maxTryTimes with header
     * @param urlString url
     * @param encode charset
     * @param paramString string of param
     * @param maxTryTimes try times
     * @param headerKeyList list of headerKey
     * @param headerValueList list of headerValue
     * @return http response
     * @throws Exception excetion
     */
    public String doPost(String urlString,String encode,String paramString,int maxTryTimes,List<String> headerKeyList,List<String> headerValueList) throws Exception{
        String result = null;
		while (maxTryTimes >= 1) {
			try {
				result = doPost(urlString, encode, paramString,headerKeyList,headerValueList);
				break;
			} catch (Exception e) {
                if (maxTryTimes == 1) {
                    throw e;
                }
			}
            maxTryTimes = maxTryTimes -1;
        }
        return result;
    }
    
    /**
     * http post with maxTryTimes without header
     * @param urlString url
     * @param encode charset
     * @param paramString string of param
     * @param maxTryTimes try times
     * @param headerKeyList list of headerKey
     * @param headerValueList list of headerValue
     * @return http response
     * @throws Exception excetion
     */
    public String doPost(String urlString,String encode,String paramString,int maxTryTimes) throws Exception{
        String result = doPost(urlString,encode,paramString,maxTryTimes,null,null);
        return result;
    }
      
}

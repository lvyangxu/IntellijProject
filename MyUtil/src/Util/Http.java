package Util;

import Models.MyException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.channels.SocketChannel;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by karl on 2016/7/14.
 */
public class Http {

    public static String get(String url) throws MyException {
        String result = "";
        try {
            URL URL1 = new URL(url);
            URLConnection URLConnection1 = URL1.openConnection();
            Map<String, String> headerMap = new HashMap<>();
            headerMap.put("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
            headerMap.put("Accept-Encoding", "gzip, deflate, sdch");
            headerMap.put("Accept-Language", "zh-CN,zh;q=0.8,fr;q=0.6,ru;q=0.4");
            headerMap.put("Cache-Control", "max-age=0");
            headerMap.put("Connection", "keep-alive");
            String host = url.replace("http://", "");
            host = new MyString(host).split("/")[0];
            headerMap.put("Host", host);
            headerMap.put("Upgrade-Insecure-Requests", "1");
            headerMap.put("User-Agent", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36");

            for (Map.Entry Entry1 : headerMap.entrySet()) {
                String key = (String) Entry1.getKey();
                String value = (String) Entry1.getValue();
                URLConnection1.setRequestProperty(key, value);
            }

            URLConnection1.connect();
            try (InputStreamReader InputStreamReader1 = new InputStreamReader(URLConnection1.getInputStream())) {
                try (BufferedReader BufferedReader1 = new BufferedReader(InputStreamReader1)) {
                    String line;
                    while ((line = BufferedReader1.readLine()) != null) {
                        result += line;
                    }
                }
            }
        } catch (MalformedURLException e) {
            throw new MyException("invalid url:" + e.getMessage());
        } catch (IOException e) {
            throw new MyException("io exception:" + e.getMessage());
        }
        return result;
    }

}

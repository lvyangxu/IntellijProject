package Util;

import Models.MyException;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by karl on 2016/4/20.
 */
public class MyString {

    private String value;

    public MyString(String value) throws MyException {
        if(value==null){
            throw new MyException("MyString value is null");
        }
        this.value = value;
    }

    /**
     * regex,remain the empty end string of value
     *
     * @param value
     * @param regex
     * @return
     */
    public String[] split(String regex) {
        Pattern Pattern1 = Pattern.compile(regex);
        Matcher Matcher1 = Pattern1.matcher(this.value);
        int count = 1;
        while (Matcher1.find()) {
            count++;
        }
        String[] result = this.value.split(regex, count);
        return result;
    }

    /**
     * base64 encode
     *
     * @return
     */
    public MyString base64Encode() {
        try {
            this.value = Base64.getEncoder().encodeToString(this.value.getBytes("utf-8"));
        } catch (UnsupportedEncodingException e) {
        }
        return this;
    }

    /**
     * base64 decode
     *
     * @return
     */
    public MyString base64Decode() throws MyException{
        try {
            byte[] asBytes = Base64.getDecoder().decode(this.value);
            this.value = new String(asBytes, "utf-8");
        }catch (Exception e){
            throw new MyException("base64 decode error");
        }
        return this;
    }

    /**
     * url encode
     * @return
     * @throws Exception
     */
    public MyString urlEncode() throws Exception{
        this.value = URLEncoder.encode(this.value,"utf-8");
        return this;
    }

    /**
     * url encode
     * @return
     * @throws Exception
     */
    public MyString urlDecode() throws Exception{
        this.value = URLDecoder.decode(this.value,"utf-8");
        return this;
    }

    /**
     * get string value
     *
     * @return
     */
    public String toString() {
        return this.value;
    }
}

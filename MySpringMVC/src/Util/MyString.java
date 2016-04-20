package Util;

import java.io.UnsupportedEncodingException;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by karl on 2016/4/20.
 */
public class MyString {

    private String value;
    public MyString(String value){
        this.value = value;
    }

    /**
     * regex,remain the empty end string of value
     * @param value
     * @param regex
     * @return
     */
    public String[] split(String regex){
        Pattern Pattern1 = Pattern.compile(regex);
        Matcher Matcher1 = Pattern1.matcher(this.value);
        int count = 1;
        while(Matcher1.find()){
            count++;
        }
        String[] result = this.value.split(regex,count);
        return result;
    }

    /**
     * encode
     * @param type
     * @return
     */
    public MyString encode(String type){
        try {
            switch (type) {
                case "base64":
                    this.value = Base64.getEncoder().encodeToString(this.value.getBytes("utf-8"));
                    break;
                default:
                    break;
            }
        } catch (UnsupportedEncodingException e) {
        }
        return this;
    }

    /**
     * decode
     * @param type
     * @return
     */
    public MyString decode(String type) throws Exception {
        switch (type) {
            case "base64":
                byte[] asBytes = Base64.getDecoder().decode(this.value);
                this.value = new String(asBytes, "utf-8");
                break;
            default:
                break;
        }
        return this;
    }

    /**
     * get string value
     * @return
     */
    public String toString(){
        return this.value;
    }
}

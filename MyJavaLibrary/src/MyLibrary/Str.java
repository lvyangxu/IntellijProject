package MyLibrary;

import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Str {

	/**
	 * regex,remain the empty end string of value
	 * @param value
	 * @param regex
	 * @return
	 */
	public static String[] split(String value,String regex){
		Pattern Pattern1 = Pattern.compile(regex);
		Matcher Matcher1 = Pattern1.matcher(value);
		int count = 1;
		while(Matcher1.find()){
			count++;
		}
		String[] result = value.split(regex,count);
		return result;
	}
	
	public static String encode(String value,String type){
		String result = null;
		try {
			switch (type) {
			case "base64":
				result = Base64.getEncoder().encodeToString(value.getBytes("utf-8"));
				break;
			default:
				break;
			}
		} catch (Exception e) {
		}		
		return result;
	}
	
	public static String decode(String value,String type){
		String result = null;
		try {
			switch (type) {
			case "base64":
				byte[] asBytes = Base64.getDecoder().decode(value);
				result = new String(asBytes, "utf-8");
				break;
			default:
				break;
			}
		} catch (Exception e) {
		}	
		return result;
	}
	

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyLibrary;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONObject;


/**
 *
 * @author anshifafeng
 */
public class DoDataTranslation {
    
    
    /**
     * ResultSet转json
     * @param ResultSet1
     * @return 
     */
    public String resultSetToJson(ResultSet ResultSet1) {
        // json数组  
        JSONArray JSONArray1 = new JSONArray();

        try {
            ResultSetMetaData ResultSetMetaData1 = ResultSet1.getMetaData();

            // 遍历ResultSet中的每条数据  
            while (ResultSet1.next()) {
                JSONObject JSONObject1 = new JSONObject();

                // 遍历每一列  
                for (int i = 1; i <= ResultSetMetaData1.getColumnCount(); i++) {
                    String columnName = ResultSetMetaData1.getColumnLabel(i);
                    String value = ResultSet1.getString(columnName);
                    JSONObject1.put(columnName, value);
                }
                JSONArray1.put(JSONObject1);
            }
        } catch (Exception e) {
            return null;
        }
        return JSONArray1.toString();    
    }
    
    /**
     * 构建标准string类型的json串
     * @param keyArr key的数组
     * @param valueArr value的数组
     * @return 返回构建好的json串
     */
    public String buildJsonString(String[] keyArr,String[] valueArr){
        if (keyArr.length != valueArr.length) {
            return null;
        }
        StringBuilder result = new StringBuilder();
        result.append("{");
        for (int i = 0; i < keyArr.length; i++) {
            result.append("\"").append(keyArr[i]).append("\":\"").append(valueArr[i]).append("\"");
            if (i != keyArr.length - 1) {
                result.append(",");
            }
        }
        result.append("}");
        return result.toString();
    }

    public String buildJsonString(String[] keyArr,List<List<String>> valueList){
        if (keyArr.length != valueList.size()) {
            return null;
        }
        StringBuilder result = new StringBuilder();   
        result.append("[");
    	for(int j=0;j<valueList.get(0).size();j++){
            result.append("{");
            for (int i = 0; i < keyArr.length; i++) {
            	
                result.append("\"").append(keyArr[i]).append("\":\"").append(valueList.get(i).get(j)).append("\"");
                if (i != keyArr.length - 1) {
                    result.append(",");
                }
            }
			result.append("}");
			if (j != valueList.get(0).size() - 1) {
				result.append(",");
			}
    	}
    	result.append("]");    	
        return result.toString();
    }    
    
    public String buildJsonIntValueString(String[] keyArr,int[] valueArr){
        if (keyArr.length != valueArr.length) {
            return null;
        }
        StringBuilder result = new StringBuilder();
        result.append("{");
        for (int i = 0; i < keyArr.length; i++) {
            result.append("\"").append(keyArr[i]).append("\":").append(valueArr[i]);
            if (i != keyArr.length - 1) {
                result.append(",");
            }
        }
        result.append("}");
        return result.toString();
    }    
    
    /**
     * 格式化浮点数为百分比,小数点保留2位
     * @param source
     * @return 
     */
    public String percentFormat(float source) {
        String result = "0";
        NumberFormat percentFormat = NumberFormat.getPercentInstance();
        percentFormat.setMaximumFractionDigits(2);
        percentFormat.setMinimumFractionDigits(2);
        try {
            result = percentFormat.format(source);
        } catch (Exception e) {
        }        
        return result;
    }
    
    /**
     * 构建mysql的in部分的字符串
     * @param name
     * @param value
     * @return 
     */
    public String stringToSqlInString(String name,String valueStr){	
		String[] valueArr = Str.split(valueStr, ",");
		List<String> appList = new ArrayList<>();
		for (String element : valueArr) {
			element = Str.decode(element, "base64");
			appList.add(element);
		}
		String result = appList.stream().map(element -> {
			element = "'" + element + "'";
			return element;
		}).collect(Collectors.joining(","));
		result = " " + name + " in (" + result + ") ";
		return result;
    }
    
	public List<String> doFormat(List<String> source, String type) {
		List<String> result = new ArrayList<>();
		DecimalFormat DecimalFormat1 = new DecimalFormat("0.00");
		switch (type) {
		case "TwoDecimal":			
			for (String value : source) {
				value = DecimalFormat1.format(Double.parseDouble(value));
				result.add(value);
			}
			break;
		case "Int":
			for (String value : source) {
				value = value.split("\\.").length == 0 ? value : value.split("\\.")[0];
				result.add(value);
			}			
			break;
		case "Percent":
			for (String value : source) {
				value = DecimalFormat1.format(Double.parseDouble(value)*100);
				value = value + "%";
				result.add(value);
			}		
			break;
		}
		return result;
	}

	public List<String> doFormat(List<String> numerator,List<String> denominator, String type) {
		List<String> result = new ArrayList<>();
		switch (type) {
		case "Division":			
			for (int i=0;i<numerator.size();i++) {
				String value = "";
				if(doFormat(denominator.get(i),"TwoDecimal").equals("0.00")){
					value = "0";
				}else{
				    value = String.valueOf(Double.parseDouble(numerator.get(i)) / Double.parseDouble(denominator.get(i)));
				    value = doFormat(value, "Percent");				
				}
				result.add(value);
			}
			break;
		}
		return result;
	}	
	
	public String doFormat(String source, String type) {
		DecimalFormat DecimalFormat1 = new DecimalFormat("0.00");
		switch (type) {
		case "TwoDecimal":			
			source = DecimalFormat1.format(Double.parseDouble(source));
			break;
		case "Int":
			source = source.split("\\.").length == 0 ? source : source.split("\\.")[0];
			break;
		case "Percent":
			source = DecimalFormat1.format(Double.parseDouble(source)*100);
			source = source + "%";
			break;
		}
		return source;
	}
	
}

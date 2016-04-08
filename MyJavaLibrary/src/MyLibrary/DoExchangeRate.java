/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyLibrary;

import java.util.List;
import java.util.function.Predicate;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.Node;

/**
 *
 * @author anshifafeng
 */
public class DoExchangeRate {
    
    DoHttpRequest DoHttpRequest1 = new DoHttpRequest();

    /**
     * 使用yahoo的api查询一个币种对美元的实时汇率
     * @param sourceCurrency 源币种大写缩写
     * @return 返回double类型的汇率，未找到时返回null
     * @throws Exception 抛出异常
     */
    @SuppressWarnings("unchecked")
	public double getExchangeRateByYahooApi(String sourceCurrency) throws Exception{
        String url = "http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote";
        String httpResult = DoHttpRequest1.doGet(url, "utf-8",2);           
        Document Document1 = DocumentHelper.parseText(httpResult);        
        Element root = Document1.getRootElement();        
		List<Node> nodes = root.selectNodes("//resource");        
        Predicate<Node> usd = (node)->node.selectSingleNode("field").getText().equals("USD/"+sourceCurrency);        
        Object[] results = nodes.stream().filter(usd).map((node)->{
        	Node n = (Node)node;
        	String xmlStr = n.selectSingleNode("field[2]").getText();
        	double rate = 1.00/Double.parseDouble(xmlStr);
        	return rate;
        }).toArray();  
        Double result = (Double)results[0];
        return result;         
    }
    
}

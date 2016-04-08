/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyLibrary;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.Node;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

/**
 *
 * @author anshifafeng
 */
public class DoXml {
    
    /**
     * ��ȡxml��ָ���ڵ����Ƶĵ�һ���ڵ��ֵ
     * @param xmlPath xml·��
     * @param nodeName �ڵ�����
     * @return ���ض�ά�ַ������飬Ԫ�طֱ�Ϊ�ڵ��ֵ���쳣��Ϣ
     */
    public String[] readFirstNodeValueByNodeName(String xmlPath,String nodeName){
        String[] result = new String[]{null, null};
        Object[] readResult = readXmlFromFile(xmlPath);
        if (readResult[1] != null) {
            result[1] = (String)readResult[1];
            return result;
        }
        Document Document1 = (Document) readResult[0];
        Element root = Document1.getRootElement();
        Node Node1;
        try {
            Node1 = root.selectSingleNode("//" + nodeName);
            if (Node1 == null) {
                result[0] = "";
            } else {
                result[0] = Node1.getStringValue();
            }
        } catch (Exception e) {
            result[1] = e.getMessage();
            return result;
        }
        
        return result;
    }
    
    /**
     * ��ȡxml��ָ���ڵ����Ƶĵ�һ���ڵ��ֵ
     *
     * @param xmlPath xml·��
     * @param nodeNameArr �ڵ����Ƶ�����
     * @return
     * ����object���͵����飬����Ԫ�طֱ�Ϊ�ڵ��ֵ��list��String���͵��쳣��Ϣ���ڵ㲻����ʱ���ؿ��ַ������ڵ�����ӽڵ�ʱ�����ӽڵ�ֵ�ĺ�
     */
    public Object[] readFirstNodeValueByNodeName(String xmlPath,String[] nodeNameArr){
        Object[] result = new Object[]{null, null};
        Object[] readResult = readXmlFromFile(xmlPath);
        if (readResult[1] != null) {
            result[1] = readResult[1];
            return result;
        }
        Document Document1 = (Document)readResult[0];
        
        Element root = Document1.getRootElement();
        List<String> nodeValueList = new ArrayList();
        Node Node1 = null;
        String nodeValue = null;
        for (String nodeName : nodeNameArr) {
            try {
                Node1 = root.selectSingleNode("//" + nodeName);
                if (Node1 == null) {
                    nodeValue = "";
                } else {
                    nodeValue = Node1.getStringValue();
                }
            } catch (Exception e) {
                nodeValue = "";
            }            
            nodeValueList.add(nodeValue);
        }
        result[0] = nodeValueList;
        return result;
    }
  
    
    /**
     * ����ָ����·����ȡxml�ļ�
     * @param xmlPath
     * @return ����object���͵����飬����Ԫ�طֱ�ΪDocument���͵�xml��Document�����String���͵��쳣��Ϣ
     */
    public Object[] readXmlFromFile(String xmlPath){
        Object[] result = new Object[]{null,null};        
        SAXReader SAXReader1 = new SAXReader();
        Document Document1 = null;
        try {
           Document1  = SAXReader1.read(new File(xmlPath));
           result[0] = Document1;
        } catch (Exception e) {
            result[1] = e.getMessage();
            return result;
        }
        
        return result;
    }
    
    /**
     * ����xml
     * @param doc Document����
     * @param savePath �����ȫ·��
     * @return �ɹ�����null,ʧ�ܷ����쳣��Ϣ
     */
    public String saveXml(Document doc, String savePath) {
        String result = null;
        synchronized (doc) {
            XMLWriter XMLWriter1 = null;
            try {
                OutputFormat format = OutputFormat.createPrettyPrint();
                XMLWriter1 = new XMLWriter(new FileOutputStream(savePath), format);
                XMLWriter1.write(doc);
            } catch (Exception e) {
                result = e.getMessage();
            }finally{
                if (XMLWriter1 != null) {
                    try {
                        XMLWriter1.close();
                    } catch (Exception e1) {
                    }
                }
            }
        }
        return result;
    }





}

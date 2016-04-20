package Util;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.Node;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by karl on 2016/4/20.
 */
public class Xml {

    private String path;
    private Document document;
    public Xml(String path) throws DocumentException {
        this.path = path;
        SAXReader SAXReader1 = new SAXReader();
        this.document = SAXReader1.read(new File(path));
    }

    /**
     * get first matched node value by name
     * @param nodeName
     * @return
     */
    public String readFirstNodeValueByNodeName(String nodeName) {
        String result = null;
        Element root = this.document.getRootElement();
        Node Node1 = root.selectSingleNode("//" + nodeName);
        if (Node1 == null) {
            result = "";
        } else {
            result = Node1.getStringValue();
        }
        return result;
    }

    /**
     * get first matched node value by name
     * @param nodeNameArr
     * @return
     */
    public List<String> readFirstNodeValueByNodeName(String[] nodeNameArr){
        List<String> result = new ArrayList<>();
        for(String nodeName:nodeNameArr){
            String value = readFirstNodeValueByNodeName(nodeName);
            result.add(value);
        }
        return result;
    }

    /**
     * save xml with given path
     * @param doc
     * @param savePath
     * @throws IOException
     */
    public static void save(Document doc, String savePath) throws IOException {
        synchronized (doc) {
            XMLWriter XMLWriter1 = null;
            OutputFormat format = OutputFormat.createPrettyPrint();
            XMLWriter1 = new XMLWriter(new FileOutputStream(savePath), format);
            XMLWriter1.write(doc);
            if (XMLWriter1 != null) {
                XMLWriter1.close();
            }
        }
    }
}

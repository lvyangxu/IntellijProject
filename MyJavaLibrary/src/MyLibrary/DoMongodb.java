/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyLibrary;

import static java.util.Arrays.asList;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.bson.Document;
import org.json.JSONObject;

import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.UpdateOptions;



/**
 *
 * @author anshifafeng
 */
public class DoMongodb {

    /**
     * JSONObjectתDocument
     * @param JsonObject1 ��ת����JSONObject
     * @return ����ת�����Document
     * @throws Exception �׳��쳣
     */
    public Document JsonToDocument(JSONObject JsonObject1) throws Exception{
        Document Document1  = new Document();
        Iterator it1 = JsonObject1.keys();
        while (it1.hasNext()) {
            String key = (String) it1.next();
            Object value = JsonObject1.get(key);
            Document1.append(key, value);
        }
        return Document1;
    }
    
    public MongoDatabase initMongodb(String database) throws Exception{
        MongoClient MongoClient1 = new MongoClient();
        MongoDatabase MongoDatabase1 = MongoClient1.getDatabase(database);
        return MongoDatabase1;
    }
    
    /**
     * ��mongodb�в���һ���µ�����
     * @param MongoDatabase1 MongoDatabase����
     * @param collections collections����
     * @param JsonObject1 Ҫ�����JsonObject����
     * @return �ɹ�����null��ʧ�ܷ����쳣��Ϣ
     */
    public String insert(MongoDatabase MongoDatabase1,String collections,JSONObject JsonObject1){
        String result = null;
        Document Document1 = new Document();
        try {
            Document1 = JsonToDocument(JsonObject1);
            MongoDatabase1.getCollection(collections).insertOne(Document1);
        } catch (Exception e) {
            result = e.getMessage();
        }
        return result;
    }
    
    /**
     * ��mongodb�и���ָ������������
     * @param MongoDatabase1 MongoDatabase����
     * @param collections collections����
     * @param JsonObject1 ���������ݵ�����
     * @param JsonObject2 ���������ݵ�ֵ
     * @param isUpsert ���ݲ�����ʱ�Ƿ����һ���µ�
     * @return �ɹ�����null��ʧ�ܷ����쳣��Ϣ
     */
    public String update(MongoDatabase MongoDatabase1,String collections,JSONObject JsonObject1,JSONObject JsonObject2,boolean isUpsert){
        String result = null;
        Document Document1 = new Document();
        Document Document2 = new Document();
        try {
            Document1 = JsonToDocument(JsonObject1);
            Document2 = JsonToDocument(JsonObject2);          
            UpdateOptions UpdateOptions1 = new UpdateOptions();
            UpdateOptions1.upsert(isUpsert);
            MongoDatabase1.getCollection(collections).updateOne(Document1,new Document("$set",Document2),UpdateOptions1);
        } catch (Exception e) {
            result = e.getMessage();
        }
        return result;
    }    


    public List<Document> doMongodbFind(MongoDatabase MongoDatabase1, String collections,JSONObject JsonObject1) throws Exception{
        List<Document> result = new ArrayList<>();
        Document Document1 = new Document();
        Document1 = JsonToDocument(JsonObject1);
        FindIterable FindIterable1 = MongoDatabase1.getCollection(collections).find(Document1);
        Iterator Iterator1 = FindIterable1.iterator();
        while (Iterator1.hasNext()) {
            Document next = (Document) Iterator1.next();
            result.add(next);
        }
        return result;        
    }
    
    public List<Document> doMongodbAggregation(MongoDatabase MongoDatabase1, String collections,JSONObject matchJSONObject,JSONObject JsonObject1) throws Exception{
        final List<Document> result = new ArrayList<>();
        Document groupDocument = JsonToDocument(JsonObject1);
        Document matchDocument = JsonToDocument(matchJSONObject);
        AggregateIterable<Document> AggregateIterable1 = MongoDatabase1.getCollection(collections).aggregate(asList(
                new Document("$match", matchDocument),
                new Document("$group", groupDocument)
        ));
        AggregateIterable1.forEach(new Block<Document>() {
            @Override
            public void apply(final Document document) {
                result.add(document);
            }
        });    
        return result;        
    }    
    
    public String doMongodbFindToJson(MongoDatabase MongoDatabase1, String collections,JSONObject JSONObject1)throws Exception{
       List<Document> findResult = doMongodbFind(MongoDatabase1,collections,JSONObject1);
       StringBuilder result = new StringBuilder();
       result.append("[");
       for(int i=0;i<findResult.size();i++){
           result.append(findResult.get(i).toJson());
           if (i != findResult.size() - 1) {
               result.append(",");
           }       
       }
       result.append("]");
       return result.toString();       
    }

    public String doMongodbAggregationToJson(MongoDatabase MongoDatabase1, String collections,JSONObject JSONObject1,JSONObject JSONObject2)throws Exception{
       List<Document> findResult = doMongodbAggregation(MongoDatabase1,collections,JSONObject1,JSONObject2);
       StringBuilder result = new StringBuilder();
       result.append("[");
       for(int i=0;i<findResult.size();i++){
           result.append(findResult.get(i).toJson());
           if (i != findResult.size() - 1) {
               result.append(",");
           }       
       }
       result.append("]");
       return result.toString();       
    }
    
}

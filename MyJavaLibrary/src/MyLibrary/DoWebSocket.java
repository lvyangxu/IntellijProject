/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyLibrary;

import javax.websocket.Session;

import org.json.JSONObject;

/**
 *
 * @author anshifafeng
 */
public class DoWebSocket {
    
    DoDataTranslation DoDataTranslation1 = new DoDataTranslation();
    
    public static class myWebSocketClass{
        
        private Session webSocketSession;
        private String username;
        private String password;
        private String leaveMessage = "";
    
        public myWebSocketClass(Session webSocketSession, String username) {
            this.webSocketSession = webSocketSession;
            this.username = username;
        }
        
        public myWebSocketClass(){
        }
        
        public void setLeaveMessage(String leaveMessage) {
            this.leaveMessage = leaveMessage;
        }

        public String getLeaveMessage() {
            return this.leaveMessage;
        }
        
        public void setWebSocketSession(Session webSocketSession) {
            this.webSocketSession = webSocketSession;
        }

        public Session getWebSocketSession() {
            return this.webSocketSession;
        }        
        
    }
    
    /**
     * �����Զ����json��ʽ������
     * @param websocketMessage json��
     * @param key ��ֵ�Ե�����
     * @return ���ظ�������Ӧ��ֵ�����Ľ��
     */
//    public String myMessageDecode(String websocketMessage,String key) {
//        try {
//            JSONObject JSONObject1 = new JSONObject(websocketMessage);
//            String value = JSONObject1.getString(key);
//            value = Str.decode(value,"base64");
//            return value;
//        } catch (Exception e) {
//            return null;
//        }
//    }
    
}

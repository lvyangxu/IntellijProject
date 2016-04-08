package MyLibrary;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;



/**
 *
 * @author anshifafeng
 */
@SuppressWarnings("unchecked")
public class DoMysql extends HttpServlet{

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	DoXml DoXml1 = new DoXml();
    DoDataTranslation DoDataTranslation1 = new DoDataTranslation();

    public class mysqlClass {

        private String ip = "";
        private String port = "";
        private String database = "";
        private String user = "";
        private String password = "";
        private Connection mysqlConnection = null;
        private String exceptionString = "";

        public mysqlClass(){
        }
        
        public String getIp() {
            return this.ip;
        }

        public void setIp(String ip) {
            this.ip = ip;
        }

        public String getPort() {
            return this.port;
        }

        public void setPort(String port) {
            this.port = port;
        }

        public String getDatabase() {
            return this.database;
        }

        public void setDatabase(String database) {
            this.database = database;
        }

        public String getUser() {
            return this.user;
        }

        public void setUser(String user) {
            this.user = user;
        }

        public String getPassword() {
            return this.password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public Connection getMysqlConnection() {
            return this.mysqlConnection;
        }

        public void setMysqlConnection(Connection mysqlConnection) {
            this.mysqlConnection = mysqlConnection;
        }
        
        public String getExceptionString() {
            return this.exceptionString;
        }

        public void setExceptionString(String exceptionString) {
            this.exceptionString = exceptionString;
        }        
    }

    public mysqlClass initMysqlByDefaultXml(String mysqlXmlPath) {
        mysqlClass mysqlClass1 = new mysqlClass();
        String[] nodeNameArr = new String[]{"ip", "port", "database", "user", "password"};
        Object[] xmlResult = DoXml1.readFirstNodeValueByNodeName(mysqlXmlPath, nodeNameArr);
        if (xmlResult[1] != null) {
            mysqlClass1.setExceptionString((String.valueOf(xmlResult[1])));
            return mysqlClass1;
        }

        List<String> nodeValueList = (List<String>) xmlResult[0];

        mysqlClass1.ip = nodeValueList.get(0);
        mysqlClass1.port = nodeValueList.get(1);
        mysqlClass1.database = nodeValueList.get(2);
        mysqlClass1.user = nodeValueList.get(3);
        mysqlClass1.password = nodeValueList.get(4);
        initMysqlConnect(mysqlClass1);
        return mysqlClass1;
    }

    
	public mysqlClass initMysqlByDefaultXml(ServletContext ServletContext1) {
        mysqlClass mysqlClass1 = new mysqlClass();
        String mysqlXmlPath = ServletContext1.getRealPath("/")+"/WEB-INF/xml/mysql.xml";
        String[] nodeNameArr = new String[]{"ip","port","database","user","password"};
        Object[] xmlResult =  DoXml1.readFirstNodeValueByNodeName(mysqlXmlPath, nodeNameArr);
        if (xmlResult[1] != null) {
            mysqlClass1.setExceptionString((String.valueOf(xmlResult[1])));
            return mysqlClass1;
        }
        List<String> nodeValueList = (List<String>)xmlResult[0];

        mysqlClass1.ip = nodeValueList.get(0);
        mysqlClass1.port = nodeValueList.get(1);
        mysqlClass1.database = nodeValueList.get(2);
        mysqlClass1.user = nodeValueList.get(3);
        mysqlClass1.password = nodeValueList.get(4);
        initMysqlConnect(mysqlClass1);
        return mysqlClass1;
    }

    private String buildJDBCConnectionString(mysqlClass mysqlClass1) {
        String ip = mysqlClass1.getIp();
        String port = mysqlClass1.getPort();
        String database = mysqlClass1.getDatabase();
        String JDBCConnectionString = "jdbc:mysql://" + ip + ":" + port + "/" + database;
        return JDBCConnectionString;
    }

    private void initMysqlConnect(mysqlClass mysqlClass1) {
        synchronized (mysqlClass1) {
            String JDBCConnectionString = buildJDBCConnectionString(mysqlClass1);
            String user = mysqlClass1.getUser();
            String password = mysqlClass1.getPassword();

            Connection Connection1 = null;
            try {
                Class.forName("com.mysql.jdbc.Driver");
                Connection1 = DriverManager.getConnection(JDBCConnectionString,
                        user, password);
                mysqlClass1.setMysqlConnection(Connection1);
                mysqlClass1.setExceptionString(null);
            } catch (Exception e) {
                mysqlClass1.setExceptionString(e.getMessage());
            }
        }
    }

    private void mysqlReconnect(mysqlClass mysqlClass1) {
        Boolean connectionIsClose = false;

        synchronized (mysqlClass1) {
            Connection Connection1 = mysqlClass1.getMysqlConnection();
            
            try {                
                connectionIsClose = Connection1.isClosed();
            } catch (Exception e) {
                mysqlClass1.setExceptionString(e.getMessage());
                return;
            }
            
            // mysqlʧЧʱִ����������
            if (connectionIsClose || Connection1 == null) {
                initMysqlConnect(mysqlClass1);
            }else{
                mysqlClass1.setExceptionString(null);
            }
        }
    }

    private List<List<String>> mysqlSelect(mysqlClass mysqlClass1, String sqlCommand) {     
        List<List<String>> ResultSetList = new ArrayList<>();
        synchronized (mysqlClass1) {
            // �ж��Ƿ���Ҫ����
            mysqlReconnect(mysqlClass1);
            if (mysqlClass1.getExceptionString() != null) {
                return ResultSetList;
            }

            Statement stmt = null;
            Connection Connection1 = mysqlClass1.getMysqlConnection();
            try {
                stmt = Connection1.createStatement();
                ResultSet ResultSet1 = stmt.executeQuery(sqlCommand);
                
                while (ResultSet1.next()) {
                    List< String> rowList = new ArrayList<>();
                    for (int j = 1; j <= ResultSet1.getMetaData().getColumnCount(); j++) {
                        rowList.add(ResultSet1.getString(j));
                    }
                    ResultSetList.add(rowList);
                }                    
                mysqlClass1.setExceptionString(null);
            } catch (Exception e) {
                mysqlClass1.setExceptionString(e.getMessage());
            } finally {
                if (stmt != null) {
                    try {
                        stmt.close();
                    } catch (Exception e2) {

                    }
                }
            }
        }
        return ResultSetList;
    }

    private String mysqlSelectToJson(mysqlClass mysqlClass1, String sqlCommand) {     
        String result = null;
        synchronized (mysqlClass1) {
            mysqlReconnect(mysqlClass1);
            if (mysqlClass1.getExceptionString() != null) {
                return result;
            }

            Statement stmt = null;
            Connection Connection1 = mysqlClass1.getMysqlConnection();
            try {
                stmt = Connection1.createStatement();
                ResultSet ResultSet1 = stmt.executeQuery(sqlCommand);
                result =  DoDataTranslation1.resultSetToJson(ResultSet1);
                mysqlClass1.setExceptionString(null);
            } catch (Exception e) {
                mysqlClass1.setExceptionString(e.getMessage());
            } finally {
                if (stmt != null) {
                    try {
                        stmt.close();
                    } catch (Exception e2) {

                    }
                }
            }
        }
        return result;
    }    
    
    public List<List<String>> doMysqlSelect(mysqlClass mysqlClass1, String sqlCommand) {
        List<List<String>> ResultSetList = mysqlSelect(mysqlClass1, sqlCommand);
        if (mysqlClass1.getExceptionString() != null) {
            ResultSetList = mysqlSelect(mysqlClass1, sqlCommand);
        }
        return ResultSetList;
    }    

    public String doMysqlSelectToJson(mysqlClass mysqlClass1, String sqlCommand) {
        String result = mysqlSelectToJson(mysqlClass1, sqlCommand);
        if (mysqlClass1.getExceptionString() != null) {
            result = mysqlSelectToJson(mysqlClass1, sqlCommand);
        }
        return result;
    }    
        
    private boolean mysqlAlter(mysqlClass mysqlClass1, String sqlCommand) {
        synchronized (mysqlClass1) {
            // �ж��Ƿ���Ҫ����
            mysqlReconnect(mysqlClass1);
            if (mysqlClass1.getExceptionString() != null) {
                return false;
            }

            Statement stmt = null;
            Connection Connection1 = mysqlClass1.getMysqlConnection();
            try {
                stmt = Connection1.createStatement();
                stmt.executeUpdate(sqlCommand);
                mysqlClass1.setExceptionString(null);
            } catch (Exception e) {
                mysqlClass1.setExceptionString(e.getMessage());
                return false;
            } finally {
                if (stmt != null) {
                    try {
                        stmt.close();
                    } catch (Exception e2) {

                    }
                }
            }
        }
        return true;
    }

    public boolean doMysqlAlter(mysqlClass mysqlClass1, String sqlCommand) {
        Boolean result =  mysqlAlter(mysqlClass1, sqlCommand);
        if (!result) {
            result =  mysqlAlter(mysqlClass1, sqlCommand);
        }        
        return result;
    }

    private boolean mysqlBatch(mysqlClass mysqlClass1, List<String> sqlCommandList) {
        synchronized (mysqlClass1) {
            mysqlReconnect(mysqlClass1);
            if (mysqlClass1.getExceptionString()!= null) {
                return false;
            }

            Statement stmt = null;
            Connection Connection1 = mysqlClass1.getMysqlConnection();
            try {
                stmt = Connection1.createStatement();
                for(String sqlCommand:sqlCommandList){
                	stmt.addBatch(sqlCommand);
                }                
                stmt.executeBatch();
                mysqlClass1.setExceptionString(null);
            } catch (Exception e) {
                mysqlClass1.setExceptionString(e.getMessage());
                return false;
            } finally {
                if (stmt != null) {
                    try {
                        stmt.close();
                    } catch (Exception e2) {

                    }
                }
            }
        }
        return true;
    }

    public boolean doMysqlBatch(mysqlClass mysqlClass1, List<String> sqlCommandList) {
        Boolean result =  mysqlBatch(mysqlClass1, sqlCommandList);
        if (!result) {
            result =  mysqlBatch(mysqlClass1, sqlCommandList);
        }        
        return result;
    }
    
    public List<String> getColumnArray(List<List<String>> sqlResult,Integer columnIndex) throws Exception{
		List<String> result = sqlResult.stream().map((row) -> {
			String value = row.get(columnIndex);
			return value;
		}).collect(Collectors.toList());
		return result;
    }
    

}

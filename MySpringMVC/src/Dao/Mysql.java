package Dao;

import Models.MyException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletContext;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by karl on 2016/4/20.
 */
public class Mysql {

    private String ip;
    private String port;
    private String database;
    private String username;
    private String password;
    private Connection connection = null;
    public Mysql(String ip, String port, String database, String username, String password) throws SQLException, ClassNotFoundException {
        this.ip = ip;
        this.port = port;
        this.database = database;
        this.username = username;
        this.password = password;
        init();
    }

    public class data{
        private List<List<String>> rows = new ArrayList<>();
        private List<List<String>> columns = new ArrayList<>();
        private String json;
        public data(ResultSet ResultSet1) throws SQLException, JSONException {
            JSONArray JSONArray1 = new JSONArray();
            while (ResultSet1.next()) {
                JSONObject JSONObject1 = new JSONObject();
                List<String> rowList = new ArrayList<>();
                for (int i = 1; i <= ResultSet1.getMetaData().getColumnCount(); i++) {
                    rowList.add(ResultSet1.getString(i));
                    String columnName = ResultSet1.getMetaData().getColumnLabel(i);
                    String value = ResultSet1.getString(columnName);
                    JSONObject1.put(columnName, value);
                }
                this.rows.add(rowList);
                JSONArray1.put(JSONObject1);
            }
            this.json = JSONArray1.toString();
            //no data,then return
            if(this.rows.size()==0){
                return;
            }
            for(int i=0;i<this.rows.get(0).size();i++){
                List<String> columnList = new ArrayList<>();
                for(int j=0;j<this.rows.size();j++){
                    columnList.add(this.rows.get(j).get(i));
                }
                this.columns.add(columnList);
            }
        }

        public String toJson(){
            return this.json;
        }

        public List<List<String>> rows(){
            return this.rows;
        }

        public List<List<String>> columns(){
            return this.columns;
        }

    }

    /**
     * jdbc string
     * @return
     */
    private String buildJDBCConnectionString() {
        String JDBCConnectionString = "jdbc:mysql://" + this.ip + ":" + this.port + "/" + this.database;
        return JDBCConnectionString;
    }

    /**
     * init connect with jdbc string
     * @throws SQLException
     */
    private void init() throws SQLException, ClassNotFoundException {
        synchronized (this) {
            String JDBCConnectionString = buildJDBCConnectionString();
            //load jdbc driver
            Class.forName("com.mysql.jdbc.Driver");
            Connection connection = DriverManager.getConnection(JDBCConnectionString, this.username, this.password);
            this.connection = connection;
        }
    }

    /**
     * reconnect while connection is closed
     * @throws SQLException
     */
    private void reconnect() throws SQLException, ClassNotFoundException {
        Boolean connectionIsClose = false;
        synchronized (this) {
            connectionIsClose = this.connection.isClosed();
            if (connectionIsClose || this.connection == null) {
                init();
            }
        }
    }

    /**
     * mysql select
     * @param sqlCommand
     * @return
     * @throws SQLException
     * @throws JSONException
     */
    private data mysqlSelect(String sqlCommand) throws SQLException, JSONException, ClassNotFoundException {
        data data1;
        synchronized (this) {
            reconnect();
            Statement stmt = this.connection.createStatement();
            ResultSet ResultSet1 = stmt.executeQuery(sqlCommand);
            data1 = new data(ResultSet1);
            stmt.close();
        }
        return data1;
    }

    /**
     * try mysql select twice
     * @param sqlCommand
     * @return
     * @throws MyException
     */
    public data select(String sqlCommand) throws MyException {
        data data1;
        try {
            data1 = mysqlSelect(sqlCommand);
        } catch (Exception e) {
            try {
                data1 = mysqlSelect(sqlCommand);
            } catch (SQLException e1) {
                throw new MyException("select SQLException:" + e1.getMessage());
            } catch (JSONException e1) {
                throw new MyException("select JSONException:" + e1.getMessage());
            } catch (ClassNotFoundException e1) {
                throw new MyException("select ClassNotFoundException:" + e1.getMessage());
            }
        }
        return data1;
    }

    /**
     * mysql update
     * @param sqlCommand
     * @throws SQLException
     */
    private void mysqlUpdate(String sqlCommand) throws SQLException, ClassNotFoundException {
        synchronized (this) {
            reconnect();
            Statement stmt = this.connection.createStatement();
            stmt.executeUpdate(sqlCommand);
            stmt.close();
        }
    }

    /**
     * try mysql update twice
     * @param sqlCommand
     * @throws MyException
     */
    public void update(String sqlCommand) throws MyException {
        try {
            mysqlUpdate(sqlCommand);
        } catch (SQLException e) {
            try {
                mysqlUpdate(sqlCommand);
            } catch (SQLException e1) {
                throw new MyException("update SQLException:"+e1.getMessage());
            } catch (ClassNotFoundException e1) {
                throw new MyException("update ClassNotFoundException:" + e1.getMessage());
            }
        } catch (ClassNotFoundException e) {
            throw new MyException("update ClassNotFoundException:" + e.getMessage());
        }
    }

    /**
     * mysql batch
     * @param sqlCommandList
     * @throws SQLException
     */
    private void mysqlBatch(List<String> sqlCommandList) throws SQLException, ClassNotFoundException {
        synchronized (this) {
            reconnect();
            Statement stmt = this.connection.createStatement();
            for (String sqlCommand : sqlCommandList) {
                stmt.addBatch(sqlCommand);
            }
            stmt.executeBatch();
            stmt.close();
        }

    }

    /**
     * try mysql batch twice
     * @param sqlCommandList
     * @throws MyException
     */
    public void batch(List<String> sqlCommandList) throws MyException {
        try {
            mysqlBatch(sqlCommandList);
        } catch (SQLException e) {
            try {
                mysqlBatch(sqlCommandList);
            } catch (SQLException e1) {
                throw new MyException("batch SQLException:"+e1.getMessage());
            } catch (ClassNotFoundException e1) {
                throw new MyException("batch ClassNotFoundException:"+e1.getMessage());
            }
        } catch (ClassNotFoundException e) {
            throw new MyException("batch ClassNotFoundException:"+e.getMessage());
        }
    }

}

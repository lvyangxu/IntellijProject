package Models;

import Init.Init;
import Util.Parameter;
import Util.MyString;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static Init.Init.*;

/**
 * Created by karl on 2016/4/26.
 */
public class Table {

    public static void create(HttpServletRequest request, String table, Map<String, String> defaultMap) throws MyException {
        //get curd common data
        List<String> fieldList = getFieldList(table);
        Integer rowNumber = getRowNumber(request, fieldList);

        //build sqlCommand
        List<String> commandList = new ArrayList<>();
        for (Integer i = 0; i < rowNumber; i++) {
            String prefix = "insert into " + table + " set ";
            String joinStr = ",";
            String command = prefix;
            for (String field : fieldList) {
                field = getFieldStr(request, field, defaultMap, i);
                command += field;
                command += joinStr;
            }
            command = command.substring(0, command.length() - joinStr.length());
            command += ";";
            commandList.add(command);
            Init.log4j.database("try create:" + command);
        }
        mysql.batch(commandList);
    }

    public static void update(HttpServletRequest request, String table, Map<String, String> defaultMap) throws MyException {
        //get curd common data
        List<String> fieldList = getFieldList(table);
        Integer rowNumber = getRowNumber(request, fieldList);

        //build sqlCommand
        List<String> commandList = new ArrayList<>();

        for (Integer i = 0; i < rowNumber; i++) {
            String prefix = "update " + table + " set ";
            String joinStr = " and ";
            String command = prefix;
            String keyFieldCommand = "";
            String notkeyFieldCommand = "";
            for (String field : fieldList) {
                String[] arr = new MyString(field).split("\\|");
                field = getFieldStr(request, field, defaultMap, i);
                String key = arr[3];
                if (key.equals("PRI")) {
                    keyFieldCommand += field;
                    keyFieldCommand += joinStr;
                } else {
                    notkeyFieldCommand += field;
                    notkeyFieldCommand += ",";
                }
            }

            command += notkeyFieldCommand.substring(0, notkeyFieldCommand.length() - 1) + " where " + keyFieldCommand.substring(0, keyFieldCommand.length() - 5);
            command += ";";
            commandList.add(command);
            Init.log4j.database("try update:" + command);
        }
        mysql.batch(commandList);

    }

    public static String read(String sqlCommand) throws MyException {
        Init.log4j.database("try read:" + sqlCommand);
        return mysql.select(sqlCommand).toJson();
    }

    public static void delete(HttpServletRequest request, String table, Map<String, String> defaultMap) throws MyException {
        //get curd common data
        List<String> fieldList = getFieldList(table);
        Integer rowNumber = getRowNumber(request, fieldList);

        //build sqlCommand
        List<String> commandList = new ArrayList<>();
        String idStr = Parameter.get(request, "id");
        String[] idArr = new MyString(idStr).split(",");
        for (Integer i = 0; i < rowNumber; i++) {
            String id = new MyString(idArr[i]).base64Decode().toString();
            String command = "delete from " + table + " where id=" + id + ";";
            commandList.add(command);
            Init.log4j.database("try delete:" + command);
        }
        mysql.batch(commandList);

    }

    public static class TableStruct {
        private String table;
        private List<String> fieldMap;

        public TableStruct(String table, List<String> fieldMap) {
            this.table = table;
            this.fieldMap = fieldMap;
        }

        public String getTable() {
            return this.table;
        }

        public List<String> getFieldMap() {
            return this.fieldMap;
        }
    }

    public static List<TableStruct> getDatabaseStruct() throws MyException {
        //get table names
        Dao.Mysql.data tables = mysql.select("show tables");
        List<String> tableNameList = tables.rows().stream().map(row -> {
            String tableName = row.get(0);
            return tableName;
        }).collect(Collectors.toList());

        //get databaseStructList
        List<TableStruct> databaseStructList = new ArrayList<>();
        for (String tableName : tableNameList) {
            Dao.Mysql.data details = null;
            details = mysql.select("desc " + tableName);
            List<String> tableStructMap = details.rows().stream().map(row -> {
                String fieldName = row.get(0);
                //filed type regex,without the number and ()
                String fieldType = row.get(1);
                String fieldIsNull = row.get(2);
                String fieldKey = row.get(3);
                String fieldDefault = row.get(4);
                String fieldAutoIncrease = row.get(5);
                Pattern Pattern1 = Pattern.compile("[a-zA-Z]+");
                Matcher Matcher1 = Pattern1.matcher(fieldType);
                Matcher1.find();
                fieldType = Matcher1.group();
                String result = fieldName + "|" + fieldType + "|" + fieldIsNull + "|" + fieldKey + "|" + fieldDefault + "|" + fieldAutoIncrease;
                return result;
            }).collect(Collectors.toList());
            TableStruct TableStruct1 = new TableStruct(tableName, tableStructMap);
            databaseStructList.add(TableStruct1);
        }
        return databaseStructList;
    }

    /**
     * get filedList
     *
     * @param table
     */
    private static List<String> getFieldList(String table) {
        //get current fieldList
        Predicate<TableStruct> tablePredicate = TableStruct1 -> TableStruct1.getTable().equals(table);
        TableStruct TableStruct1 = tableStructList.stream().filter(tablePredicate).collect(Collectors.toList()).get(0);
        List<String> fieldList = TableStruct1.getFieldMap();
        return fieldList;
    }

    /**
     * get number of rows
     *
     * @param request
     * @param fieldList
     * @return
     */
    private static Integer getRowNumber(HttpServletRequest request, List<String> fieldList) throws MyException {
        String defaultKeyValue = Parameter.get(request, "id");
        if (defaultKeyValue == null) {
            String defaultKey = new MyString(fieldList.get(1)).split("\\|")[0];
            defaultKeyValue = Parameter.get(request, defaultKey);
        }
        Integer rowNumber = new MyString(defaultKeyValue).split(",").length;
        return rowNumber;
    }

    /**
     * get field string
     *
     * @param request
     * @param field
     * @param defaultMap
     * @param i
     * @return
     * @throws MyException
     */
    private static String getFieldStr(HttpServletRequest request, String field, Map<String, String> defaultMap, Integer i) throws MyException {
        String[] arr = new MyString(field).split("\\|");
        String name = arr[0];
        String type = arr[1];
        String value = "";
        String valueTypeStr = type.equals("int") ? "" : "'";
        //self defined value by map
        if (defaultMap.containsKey(name)) {
            value = defaultMap.get(name);
            field = name + "=" + value;
        } else {
            value = Parameter.get(request, name);
            //if client don't send value of filed,then default set ''
            if (value == null) {
                value = "";
            }
            if (name.equals("id") && value.equals("")) {
                field = "id=null";
                return field;
            }

            //decode
            String[] valueArr = new MyString(value).split(",");
            value = new MyString(valueArr[i]).base64Decode().toString();
            //escape charactor
            value = value.replace("'", "\\'");
            value = valueTypeStr + value + valueTypeStr;
            String connectStr = "=";
            field = name + connectStr + value;
        }
        return field;
    }

}

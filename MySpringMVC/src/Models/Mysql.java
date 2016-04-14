package Models;

/**
 * Created by karl on 2016/4/12.
 */
public class Mysql {
//    DoMysql DoMysql1 = new DoMysql();
//    DoDataTranslation DoDataTranslation1 = new DoDataTranslation();
//    DoServletContext DoServletContext1 = new DoServletContext();
//
//    /**
//     * mysql update
//     * @param sqlCommand
//     * @return boolean
//     */
//    public boolean doMysqlUpdate(String sqlCommand){
//        boolean alterResult = DoMysql1.doMysqlAlter(Init.mysqlClass1, sqlCommand);
//        return alterResult;
//    }
//
//    public boolean doMysqlBatch(List<String> sqlCommandList){
//        boolean alterResult = DoMysql1.doMysqlBatch(Init.mysqlClass1, sqlCommandList);
//        return alterResult;
//    }
//
//    /**
//     * mysql select
//     * @param sqlCommand
//     * @return null/String
//     */
//    public String doMysqlSelect(String sqlCommand) {
//        String result = DoMysql1.doMysqlSelectToJson(Init.mysqlClass1, sqlCommand);
//        return result;
//    }
//
//    /**
//     * mysql select
//     * @param sqlCommand
//     * @return nested list
//     */
//    public static List<List<String>> doMysqlSelect1(String sqlCommand){
//        List<List<String>> result = DoMysql1.doMysqlSelect(Init.mysqlClass1, sqlCommand);
//        return result;
//    }
//
//    /**
//     * 根据时间构建list
//     * @param sqlList sql查询结果
//     * @param areaTimeList 时间列表
//     * @param defaultValueList 默认值
//     * @return 返回构建好的list
//     */
//    public List<List<String>> bulidList(List<List<String>> sqlList,List<String> areaTimeList,List<String> defaultValueList){
//        List<List<String>> result = new ArrayList<>();
//
//        for(int i=0;i<defaultValueList.size();i++){
//            List<String> column = new ArrayList<>();
//            result.add(column);
//        }
//
//        if (!sqlList.isEmpty()) {
////			if (sqlList.get(0).get(0) != null) {
//
//            for(String areaTime:areaTimeList){
//                //判断数据库中是否有结果
//                boolean isInSqlResult = false;
//                for (int i = 0; i < sqlList.size(); i++) {
//                    String day = sqlList.get(i).get(0);
//                    if (day.equals(areaTime)) {
//                        isInSqlResult = true;
//                        break;
//                    }
//                }
//                if (isInSqlResult) {
//                    for (int i = 0; i < sqlList.size(); i++) {
//                        String day = sqlList.get(i).get(0);
//                        // 找到日期对应的数据
//                        if (day.equals(areaTime)) {
//                            for(int j=0;j<sqlList.get(0).size();j++){
//                                result.get(j).add(sqlList.get(i).get(j));
//                            }
//                        }
//                    }
//                } else {
//                    for(int i=0;i<defaultValueList.size();i++){
//                        if(i==0){
//                            result.get(i).add(areaTime);
//                        }else{
//                            result.get(i).add(defaultValueList.get(i));
//                        }
//                    }
//                }
//            }
//
////			}
//        }else{
//            for (String areaTime : areaTimeList) {
//                for (int i = 0; i < defaultValueList.size(); i++) {
//                    if (i == 0) {
//                        result.get(i).add(areaTime);
//                    } else {
//                        result.get(i).add("0");
//                    }
//                }
//            }
//        }
//        return result;
//    }
//
//    /**
//     * 根据时间及第二个关键列构建list
//     * @param sqlList sql查询结果
//     * @param areaTimeList 时间列表
//     * @param defaultValueList 默认值
//     * @return 返回构建好的list
//     */
//    public List<List<String>> bulidList(List<List<String>> sqlList,List<String> areaTimeList,List<String> secondKeyList,List<String> defaultValueList){
//        List<List<String>> result = new ArrayList<>();
//        for(int i=0;i<defaultValueList.size();i++){
//            List<String> column = new ArrayList<>();
//            result.add(column);
//        }
//
//        if (!sqlList.isEmpty()) {
//
//            for(String areaTime:areaTimeList){
//                for(String secondKey:secondKeyList){
//                    //判断数据库中是否有结果
//                    boolean isInSqlResult = false;
//                    for (int i = 0; i < sqlList.size(); i++) {
//                        String day = sqlList.get(i).get(0);
//                        String sKey = sqlList.get(i).get(1);
//                        if (day.equals(areaTime)&&sKey.equals(secondKey)) {
//                            isInSqlResult = true;
//                            break;
//                        }
//                    }
//                    if (isInSqlResult) {
//                        for (int i = 0; i < sqlList.size(); i++) {
//                            String day = sqlList.get(i).get(0);
//                            String sKey = sqlList.get(i).get(1);
//                            // 找到日期对应的数据
//                            if (day.equals(areaTime)&&sKey.equals(secondKey)) {
//                                for(int j=0;j<sqlList.get(0).size();j++){
//                                    result.get(j).add(sqlList.get(i).get(j));
//                                }
//                            }
//                        }
//                    } else {
//                        for(int i=0;i<defaultValueList.size();i++){
//                            if(i==0){
//                                result.get(i).add(areaTime);
//                            }else if(i==1){
//                                result.get(i).add(secondKey);
//                            }else{
//                                result.get(i).add(defaultValueList.get(i));
//                            }
//                        }
//                    }
//                }
//
//            }
//
////			}
//        }else{
//            for (String areaTime : areaTimeList) {
//                for (String secondKey : secondKeyList) {
//                    for (int i = 0; i < defaultValueList.size(); i++) {
//                        if (i == 0) {
//                            result.get(i).add(areaTime);
//                        } else if (i == 1) {
//                            result.get(i).add(secondKey);
//                        } else {
//                            result.get(i).add("0");
//                        }
//                    }
//                }
//            }
//        }
//        return result;
//    }
//
//
//    public List<List<String>> bulidList(List<List<String>> sqlList, List<String> areaTimeList, int defaultValueNum) {
//        List<String> defaultValueList = new ArrayList<>();
//        for(int i=0;i<defaultValueNum;i++){
//            defaultValueList.add("0");
//        }
//        List<List<String>> result = bulidList(sqlList, areaTimeList, defaultValueList);
//        return result;
//    }
//
//    public List<List<String>> bulidList(List<List<String>> sqlList, List<String> areaTimeList,List<String> secondKeyList, int defaultValueNum) {
//        List<String> defaultValueList = new ArrayList<>();
//        for(int i=0;i<defaultValueNum;i++){
//            defaultValueList.add("0");
//        }
//        List<List<String>> result = bulidList(sqlList, areaTimeList,secondKeyList, defaultValueList);
//        return result;
//    }
//
//    public class TableStruct{
//        private String table;
//        private List<String> fieldMap;
//        public TableStruct(String table,List<String> fieldMap){
//            this.table = table;
//            this.fieldMap = fieldMap;
//        }
//        public String getTable(){
//            return this.table;
//        }
//        public List<String> getFieldMap(){
//            return this.fieldMap;
//        }
//    }
//
//    /**
//     * get database struct
//     * @return list of type TableStruct
//     * @throws Exception
//     */
//    public List<TableStruct> getDatabaseStruct() throws Exception{
//        //get table names
//        List<List<String>> tableList = DoMysql1.doMysqlSelect(Init.mysqlClass1, "show tables");
//        List<String> tables = DoMysql1.getColumnArray(tableList, 0);
//        List<TableStruct> databaseStructList = tables.stream().map((table) -> {
//            List<List<String>> tableStructList = DoMysql1.doMysqlSelect(Init.mysqlClass1, "desc " + table);
//
//            List<String> tableStructMap = tableStructList.stream().map((row) -> {
//                String fieldName = row.get(0);
//                //filed type regex,without the number and ()
//                String fieldType = row.get(1);
//                String fieldIsNull = row.get(2);
//                String fieldKey = row.get(3);
//                String fieldDefault = row.get(4);
//                String fieldAutoIncrease = row.get(5);
//                Pattern Pattern1 = Pattern.compile("[a-zA-Z]+");
//                Matcher Matcher1 = Pattern1.matcher(fieldType);
//                Matcher1.find();
//                fieldType = Matcher1.group();
//                String result = fieldName+"|"+fieldType+"|"+fieldIsNull+"|"+fieldKey+"|"+fieldDefault+"|"+fieldAutoIncrease;
//                return result;
//            }).collect(Collectors.toList());
//            TableStruct TableStruct1 = new TableStruct(table, tableStructMap);
//            return TableStruct1;
//        }).collect(Collectors.toList());
//        return databaseStructList;
//    }
//
//    private String doSql(List<TableStruct> databaseStructList, String action, String table, HttpServletRequest request, Map<String,String> tailMap, String overRideSqlCommand) throws Exception{
//        //find table name
//        Predicate<TableStruct> tablePredicate = TableStruct1->TableStruct1.getTable().equals(table);
//        String result = databaseStructList.stream().filter(tablePredicate).map(TableStruct1->{
//            List<String> fieldList = TableStruct1.getFieldMap();
//            String jsonResult = "{\"success\":\"false\",\"message\":\"Server Internal Error\"}";
//            String sqlCommand = "";
//            List<String> CommandList = new ArrayList<>();
//            boolean sqlResult = false;
//            //get table field name string
//            List<String> fieldNameList = fieldList.stream().map(field -> {
//                String[] arr = Str.split(field,"\\|");
//                String name = arr[0];
//                return name;
//            }).collect(Collectors.toList());
//            List<String> fieldExtraList = fieldList.stream().map(field -> {
//                String[] arr = Str.split(field,"\\|");
//                String extra = arr[5];
//                return extra;
//            }).collect(Collectors.toList());
//            //get value rows
//            Integer rows;
//            if(fieldExtraList.get(0).equals("auto_increment")){
//                rows = Str.split(DoServletContext1.getRequestPara(request,fieldNameList.get(1)),",").length;
//            }else{
//                rows = Str.split(DoServletContext1.getRequestPara(request,fieldNameList.get(0)),",").length;
//            }
//            List<Integer> indexs = new ArrayList<>();
//            for(Integer i=0;i<rows;i++){
//                indexs.add(i);
//            }
//            Predicate<String> emptyPredicate = d->!d.equals("");
//
//            switch (action) {
//                case "Update":
//                    Predicate<String> keyFiled = field->{
//                        String[] arr = Str.split(field,"\\|");
//                        String key = arr[2];
//                        return key.equals("PRI");
//                    };
//                    Predicate<String> notKeyFiled = field->{
//                        String[] arr = Str.split(field,"\\|");
//                        String key = arr[2];
//                        return !key.equals("PRI");
//                    };
//
//                    CommandList = indexs.stream().map(i->{
//                        String prefix = "update " + table + " set ";
//                        String command = prefix + fieldList.stream().filter(notKeyFiled).map(field -> {
//                            String[] arr = Str.split(field,"\\|");
//                            String name = arr[0];
//                            String type = arr[1];
//                            String value = "";
//                            String valueTypeStr = type.equals("int")?"":"'";
//                            //self defined value by map
//                            if(tailMap.containsKey(name)){
//                                value=tailMap.get(name);
//                                field = name + "="+value;
//                            }else{
//                                value = request.getParameter(name);
//                                if(value==null){
//                                    return "";
//                                }
//                                //decode
//                                String[] valueArr = Str.split(value,",");
//                                value = Str.decode(valueArr[i],"base64");
//                                value = valueTypeStr + value + valueTypeStr;
//                                String connectStr = "=";
//                                field = name + connectStr + value;
//                            }
//                            return field;
//                        }).filter(emptyPredicate).collect(Collectors.joining(","));
//                        command += " where " +fieldList.stream().filter(keyFiled).map(field -> {
//                            String[] arr = Str.split(field,"\\|");
//                            String name = arr[0];
//                            String type = arr[1];
//                            String value = "";
//                            String valueTypeStr = type.equals("int")?"":"'";
//                            //self defined value by map
//                            if(tailMap.containsKey(name)){
//                                value=tailMap.get(name);
//                                field = name + "="+value;
//                            }else{
//                                value = request.getParameter(name);
//                                if(value==null){
//                                    return "";
//                                }
//                                //decode
//                                String[] valueArr = Str.split(value,",");
//                                value = Str.decode(valueArr[i],"base64");
//                                value = valueTypeStr + value + valueTypeStr;
//                                String connectStr = "=";
//                                field = name + connectStr + value;
//
//                            }
//                            return field;
//                        }).filter(emptyPredicate).collect(Collectors.joining(" and "));
//                        command += ";";
//                        return command;
//                    }).collect(Collectors.toList());
//                    sqlResult = doMysqlBatch(CommandList);
//                    if(sqlResult){
//                        jsonResult = "{\"success\":\"true\",\"message\":\"\"}";
//                    }
//                    break;
//                case "Read":
//                    sqlCommand = overRideSqlCommand.equals("")?("select * from "+table):overRideSqlCommand;
//                    jsonResult = doMysqlSelect(sqlCommand);
//                    jsonResult = "{\"success\":\"true\",\"message\":"+jsonResult+"}";
//                    if(Init.mysqlClass1.getExceptionString()!=null){
//                        jsonResult = "{\"success\":\"false\",\"message\":\"Server Internal Error\"}";
//                    }
//                    break;
//                case "Create":
//                case "Delete":
//                    CommandList = indexs.stream().map(i->{
//                        String prefix = action.equals("Create")?"insert into " + table + " set ":"delete from " + table + " where ";
//                        String joinStr = action.equals("Create")?",":" and ";
//                        String command = prefix + fieldList.stream().map(field -> {
//                            String[] arr = Str.split(field,"\\|");
//                            String name = arr[0];
//                            String type = arr[1];
//                            String value = "";
//                            String valueTypeStr = type.equals("int")?"":"'";
//                            //self defined value by map
//                            if(tailMap.containsKey(name)){
//                                value=tailMap.get(name);
//                                field = name + "="+value;
//                            }else{
//                                value = request.getParameter(name);
//                                if(value==null){
//                                    return "";
//                                }
//                                //decode
//                                String[] valueArr = Str.split(value,",");
//                                value = Str.decode(valueArr[i],"base64");
//                                value = valueTypeStr + value + valueTypeStr;
//                                String connectStr = "=";
//                                field = name + connectStr + value;
//
//
//                            }
//                            return field;
//                        }).filter(emptyPredicate).collect(Collectors.joining(joinStr));
//                        command += ";";
//                        return command;
//                    }).collect(Collectors.toList());
//                    sqlResult = doMysqlBatch(CommandList);
//                    if(sqlResult){
//                        jsonResult = "{\"success\":\"true\",\"message\":\"\"}";
//                    }
//                    break;
//
//                default:
//                    jsonResult = "{\"success\":\"false\",\"message\":\"Unknown Action\"}";
//                    break;
//            }
//            return jsonResult;
//        }).collect(Collectors.joining());
//        if(result.equals("")){
//            result = "{\"success\":\"false\",\"message\":\"Unknown Table\"}";
//        }
//
//        return result;
//    }
//
//
//    public String doSqlCURD(List<TableStruct> databaseStructList,String action,String table,HttpServletRequest request,Map<String,String> tailMap,String overRideSqlCommand){
//        String result = "";
//        try {
//            result = doSql(databaseStructList,action,table,request,tailMap,overRideSqlCommand);
//        } catch (Exception e) {
//            Init.log4j.error().info(table+" "+action+" error:"+e.getMessage());
//            result = "{\"success\":\"false\",\"message\":\"Server Internal Error\"}";
//        }
//        return result;
//    }
//
//    public String doSqlCURD(List<TableStruct> databaseStructList,String action,String table,HttpServletRequest request,Map<String,String> tailMap){
//        String result = doSqlCURD(databaseStructList,action,table,request,tailMap,"");
//        return result;
//    }
}

package Models;

import static Init.Init.mysql;

/**
 * Created by karl on 2016/4/26.
 */
public class Table {

    public static void create(){

    }

    public static void update(){

    }

    public static String read(String table, String sqlCommand) throws MyException {
        return mysql.select(sqlCommand).toJson();
    }

    public static void delete(){

    }

}

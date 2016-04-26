package Models;

import Util.*;
import Util.Mysql;

import java.util.Optional;

import static Init.Init.mysql;

/**
 * Created by karl on 2016/4/26.
 */
public class Table {

    public static void create(){

    }

    public static void update(){

    }

    public static String read(String table, String ...overRidSqlCommand) throws MyException {
        String sqlCommand = (overRidSqlCommand.length==0)?"select * from "+table:overRidSqlCommand[0];
        return mysql.select(sqlCommand).toJson();
    }

    public static void delete(){

    }

}

package Util;

import Models.MyException;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * Created by karl on 2016/5/12.
 */
public class Path {

    public static void create(String folderDir) throws MyException {
        File File1 = new File(folderDir);
        if (!File1.exists()) {
            Boolean isCreated = File1.mkdirs();
            if (!isCreated) {
                throw new MyException("createDirFailed");
            }
        }
    }

    public static List<String> getChildrenFileName(String folderDir) throws MyException {
        List<String> result = new ArrayList<>();
        File File1 = new File(folderDir);
        if(!File1.exists()){
            return result;
        }
        File[] fileNameArr = File1.listFiles();
        Predicate<File> Predicate1 = d->!d.isDirectory();
        File[] filterFileArr = (File[]) Arrays.stream(fileNameArr).filter(Predicate1).toArray();
        result = Arrays.stream(filterFileArr).map(d->{
            String name = d.getName();
            return name;
        }).collect(Collectors.toList());

        return result;
    }

    public static List<File> getChildrenFile(String folderDir) throws MyException{
        List<File> result = new ArrayList<>();
        File File1 = new File(folderDir);
        if(!File1.exists()){
            return result;
        }
        File[] fileNameArr = File1.listFiles();
        Predicate<File> Predicate1 = d->!d.isDirectory();
        result = Arrays.stream(fileNameArr).filter(Predicate1).collect(Collectors.toList());
        return result;
    }

}

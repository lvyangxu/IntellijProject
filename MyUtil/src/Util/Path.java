package Util;

import Models.MyException;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * Created by karl on 2016/5/12.
 */
public class Path {

    /**
     * create directory if not exist
     * @param folderDir
     * @throws MyException
     */
    public static void create(String folderDir) throws MyException {
        File File1 = new File(folderDir);
        if (!File1.exists()) {
            Boolean isCreated = File1.mkdirs();
            if (!isCreated) {
                throw new MyException("createDirFailed");
            }
        }
    }

    /**
     * get children file name except directory
     *
     * @param folderDir
     * @return
     * @throws MyException
     */
    public static List<String> getChildrenFileName(String folderDir) throws MyException {
        List<String> result = new ArrayList<>();
        File File1 = new File(folderDir);
        if (!File1.exists()) {
            return result;
        }
        File[] fileNameArr = File1.listFiles();
        Predicate<File> Predicate1 = d -> !d.isDirectory();
        List<File> filterFileList = Arrays.stream(fileNameArr).filter(Predicate1).collect(Collectors.toList());
        result = filterFileList.stream().map(d -> {
            String name = d.getName();
            return name;
        }).collect(Collectors.toList());
        return result;
    }

    /**
     * get children file except directory
     *
     * @param folderDir
     * @return
     * @throws MyException
     */
    public static List<File> getChildrenFile(String folderDir) throws MyException {
        List<File> result = new ArrayList<>();
        File File1 = new File(folderDir);
        if (!File1.exists()) {
            return result;
        }
        File[] fileNameArr = File1.listFiles();
        Predicate<File> Predicate1 = d -> !d.isDirectory();
        result = Arrays.stream(fileNameArr).filter(Predicate1).collect(Collectors.toList());
        return result;
    }

    /**
     * get all children file with there relative path
     *
     * @param folderDir
     * @return
     * @throws MyException
     */
    private static List<String> getAllChildrenFileName(String folderDir, String relativePath) throws MyException {
        List<String> result = new ArrayList<>();
        File File1 = new File(folderDir);
        if (!File1.exists()) {
            return result;
        }
        File[] fileNameArr = File1.listFiles();
        Predicate<File> Predicate1 = d -> d.isDirectory();
        Predicate<File> Predicate2 = d -> !d.isDirectory();

        List<File> filterFileList1 = Arrays.stream(fileNameArr).filter(Predicate1).collect(Collectors.toList());
        for (File directoryFile : filterFileList1) {
            result.addAll(getAllChildrenFileName(folderDir + directoryFile.getName() + "/", directoryFile.getName()));
        }

        List<File> filterFileList2 = Arrays.stream(fileNameArr).filter(Predicate2).collect(Collectors.toList());
        for (File file : filterFileList2) {
            String path = relativePath.equals("") ? "" : (relativePath + "/");
            result.add(path + file.getName());
        }
        return result;
    }

    /**
     * get all children file with there relative path
     *
     * @param folderDir
     * @return
     * @throws MyException
     */
    public static List<String> getAllChildrenFileName(String folderDir) throws MyException {
        List<String> result = getAllChildrenFileName(folderDir, "");
        return result;
    }


}

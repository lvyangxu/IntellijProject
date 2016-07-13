package Util;

import Models.MyException;

import java.io.*;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Created by karl on 2016/7/11.
 */
public class Zip {

    /**
     * zip path or file to output path
     *
     * @param inputPath
     * @param outputPath
     * @param childrenFilter
     * @throws MyException
     */
    public static void zip(Map<String, Integer> inputMap, String outputPath) throws MyException {
        try {
            try (ZipOutputStream ZipOutputStream1 = new ZipOutputStream(new FileOutputStream(outputPath))) {
                try (BufferedOutputStream BufferedOutputStream1 = new BufferedOutputStream(ZipOutputStream1)) {
                    for (Map.Entry Entry1 : inputMap.entrySet()) {

                        String inputPath = (String) Entry1.getKey();
                        //back to parent folder
                        Integer parentFolderLevel = (Integer) Entry1.getValue();

                        File inputFile = new File(inputPath);
                        if (!inputFile.exists()) {
                            continue;
                        }
                        String[] arr = new MyString(inputPath).split("/");
                        if (inputFile.isDirectory()) {
                            List<String> filePathList = Path.getAllChildrenFileName(inputPath);
                            for (String filePath : filePathList) {
                                //except zip file it self
                                if ((inputPath + filePath).equals(outputPath)) {
                                    continue;
                                }
                                String relativePath = "";
                                String[] parentFolder = new MyString(inputPath).split("/");
                                for (int i = 1; i < parentFolder.length; i++) {
                                    if (parentFolderLevel >= parentFolder.length - i) {
                                        relativePath += parentFolder[i - 1] + "/";
                                    }
                                }

                                relativePath += filePath;
                                addEntry(ZipOutputStream1, BufferedOutputStream1, inputPath + filePath, relativePath);
                            }
                        } else {
                            String relativePath = arr[arr.length - 2] + "/" + inputFile.getName();
                            addEntry(ZipOutputStream1, BufferedOutputStream1, inputPath, relativePath);
                        }
                    }
                }
            }
        } catch (FileNotFoundException e) {
            throw new MyException("file not found:" + e.getMessage());
        } catch (IOException e) {
            throw new MyException("IO exception:" + e.getMessage());
        }

    }

    public static void unzip() {

    }

    /**
     * add an entry when doing zip
     *
     * @param ZipOutputStream1
     * @param BufferedOutputStream1
     * @param filePath
     * @param filePathInZip
     * @throws MyException
     */
    private static void addEntry(ZipOutputStream ZipOutputStream1, BufferedOutputStream BufferedOutputStream1, String filePath, String filePathInZip) throws MyException {
        try {
            ZipEntry ZipEntry1 = new ZipEntry(filePathInZip);
            ZipEntry1.setSize(new File(filePath).length());
            ZipOutputStream1.putNextEntry(ZipEntry1);
            try (FileInputStream FileInputStream1 = new FileInputStream(filePath)) {
                try (BufferedInputStream BufferedInputStream1 = new BufferedInputStream(FileInputStream1)) {
                    int b;
                    while ((b = BufferedInputStream1.read()) != -1) {
                        BufferedOutputStream1.write(b);
                    }
                    BufferedOutputStream1.flush();
                }
            }
        } catch (IOException e) {
            throw new MyException("IO excetion:" + e.getMessage());
        }
    }

}

package Util;

import Models.MyException;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.usermodel.*;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by karl on 2016/5/11.
 */
public class Poi {
    /**
     * 使用openxml创建excel
     *
     * @param filePath  excel文件路径
     * @param sheetName 第一个sheet名称
     * @param content   内容,以\t和\n隔开
     */
    public static void creatExcel(String filePath, String sheetName, StringBuilder content) throws MyException {
        XSSFWorkbook Workbook1 = new XSSFWorkbook();
        XSSFSheet Sheet1 = Workbook1.createSheet(sheetName);
        XSSFCellStyle cellstyle = (XSSFCellStyle) Workbook1.createCellStyle();
        //居中
        cellstyle.setAlignment(HorizontalAlignment.CENTER);
        cellstyle.setVerticalAlignment(VerticalAlignment.CENTER);

        String arrString = content.toString().replace("\r\n", "\n");
        String[] arrRow = arrString.split("\n");
        Map<Integer, Integer> columnLengthMap = new HashMap<Integer, Integer>();
        for (int i = 0; i < arrRow.length; i++) {
            String[] arrCell = arrRow[i].split("\t");
            XSSFRow Row1 = Sheet1.createRow(i);
            for (int j = 0; j < arrCell.length; j++) {
                XSSFCell cell = Row1.createCell(j);
                cell.setCellValue(arrCell[j]);
                cell.setCellStyle(cellstyle);
                try {
                    if (columnLengthMap.get(j) == null) {
                        columnLengthMap.put(j, arrCell[j].getBytes("GBK").length);
                    } else {
                        if (arrCell[j].getBytes("GBK").length > columnLengthMap.get(j)) {
                            columnLengthMap.put(j, arrCell[j].getBytes("GBK").length);
                        }
                    }
                } catch (UnsupportedEncodingException e) {
                    throw new MyException("unknown encoding");
                }

            }

        }
        //设置列宽
        for (Map.Entry<Integer, Integer> columnLength : columnLengthMap.entrySet()) {
            Sheet1.setColumnWidth(columnLength.getKey(), (columnLength.getValue() + 2) * 256);
        }

        //冻结拆分窗口
        Sheet1.createFreezePane(1, 1);

        //保存
        FileOutputStream FileOutputStream1 = null;
        try {
            FileOutputStream1 = new FileOutputStream(filePath);
            Workbook1.write(FileOutputStream1);
            FileOutputStream1.close();
            FileOutputStream1.close();
            Workbook1.close();
        } catch (FileNotFoundException e) {
            throw new MyException("unknown save path:" + e.getMessage());
        } catch (IOException e) {
            throw new MyException("save file failed:" + e.getMessage());
        }

    }

    /**
     * 读取excel
     *
     * @param filePath 文件路径
     * @return 返回list
     */
    public static List<List<String>> readExcel(String filePath) throws MyException {
        List<List<String>> result = new ArrayList<>();
        XSSFWorkbook Workbook1 = null;
        try {
            Workbook1 = new XSSFWorkbook(filePath);
        } catch (IOException e) {
            throw new MyException("read excel failed:"+e.getMessage());
        }
        XSSFSheet sheet = Workbook1.getSheetAt(0);
        int rowNum = sheet.getLastRowNum();

        for (int i = 0; i <= rowNum; i++) {
            XSSFRow row = sheet.getRow(i);
            List<String> rowList = new ArrayList<>();
            if (row == null) {
                rowList.add(null);
                result.add(rowList);
                continue;
            }

            int colNum = row.getPhysicalNumberOfCells();

            row = sheet.getRow(i);
            for (int j = 0; j < colNum; j++) {
                rowList.add(String.valueOf(row.getCell((short) j)).trim());
            }
            result.add(rowList);
        }

        try {
            Workbook1.close();
        } catch (IOException e) {
            throw new MyException("close workbook failed:"+e.getMessage());
        }

        return result;
    }

}

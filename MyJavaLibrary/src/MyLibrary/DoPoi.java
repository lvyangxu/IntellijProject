/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyLibrary;

import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;




/**
 *
 * @author anshifafeng
 */
public class DoPoi {
    
    /**
     * 使用openxml创建excel
     * @param filePath excel文件路径
     * @param sheetName 第一个sheet名称
     * @param content 内容,以\t和\n隔开
     * @return 成功返回null,失败返回异常信息
     */
    public String creatExcel(String filePath,String sheetName,StringBuilder content){
        String result = null;
        FileOutputStream FileOutputStream1 = null;
        XSSFWorkbook Workbook1 = null;
        try {
            Workbook1 = new XSSFWorkbook();
            XSSFSheet Sheet1 = Workbook1.createSheet(sheetName);
            XSSFCellStyle cellstyle = (XSSFCellStyle) Workbook1.createCellStyle();
            //居中
            cellstyle.setAlignment(HorizontalAlignment.CENTER);
            cellstyle.setVerticalAlignment(VerticalAlignment.CENTER);

            String arrString = content.toString().replace("\r\n", "\n");
            String[] arrRow = arrString.split("\n");
            Map<Integer,Integer> columnLengthMap = new HashMap<Integer,Integer>();
            for (int i = 0; i < arrRow.length; i++) {
                String[] arrCell = arrRow[i].split("\t");                
                XSSFRow Row1 = Sheet1.createRow(i);                
                for (int j = 0; j < arrCell.length; j++) {
                	XSSFCell cell = Row1.createCell(j);
                    cell.setCellValue(arrCell[j]);
                    cell.setCellStyle(cellstyle);                   
                    if (columnLengthMap.get(j) == null) {
                        columnLengthMap.put(j, arrCell[j].getBytes("GBK").length);
                    } else {
                        if (arrCell[j].getBytes("GBK").length > columnLengthMap.get(j)) {
                            columnLengthMap.put(j, arrCell[j].getBytes("GBK").length);
                        }
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
            FileOutputStream1 = new FileOutputStream(filePath);
            Workbook1.write(FileOutputStream1);
            FileOutputStream1.close();            
        } catch (Exception e) {
            result = e.getMessage();
        }finally{
            if (FileOutputStream1 != null) {
                try {
                    FileOutputStream1.close();
                } catch (Exception e) {
                }
            }
            if(Workbook1!=null){
                try {
                    Workbook1.close();
                } catch (Exception e) {
                }
            
            }
        }
        
        return result;
    }
    
    /**
     * 读取excel
     * @param filePath 文件路径
     * @return 返回list
     */
    public List<List<String>> readExcel(String filePath){
        List<List<String>> result = new ArrayList<>();
        XSSFWorkbook Workbook1 = null;
        try {
            Workbook1 = new XSSFWorkbook(filePath);
        } catch (Exception e) {
            return null;
        }
        XSSFSheet sheet = Workbook1.getSheetAt(0);
        int rowNum = sheet.getLastRowNum();

		for (int i = 0; i <= rowNum; i++) {
			XSSFRow row = sheet.getRow(i);
			List<String> rowList = new ArrayList<>();
			if(row==null){
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
		try{
			Workbook1.close();
		}catch(Exception e){
			
		}
		
        return result;
    }
    

}

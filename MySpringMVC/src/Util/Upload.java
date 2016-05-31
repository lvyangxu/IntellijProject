package Util;

import Models.MyException;
import org.apache.poi.poifs.poibrowser.Util;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.Iterator;

/**
 * Created by karl on 2016/5/31.
 */
public class Upload {

    public static void springMvcFileUpload(HttpServletRequest request, HttpServletResponse response, String fileSavePath, String fileSaveName) throws MyException {
        //创建一个通用的多部分解析器
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(request.getSession().getServletContext());
        //判断 request 是否有文件上传,即多部分请求
        if (multipartResolver.isMultipart(request)) {
            //转换成多部分request
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
            //取得request中的所有文件名
            Iterator<String> iter = multiRequest.getFileNames();
            while (iter.hasNext()) {
                //取得上传文件
                MultipartFile file = multiRequest.getFile(iter.next());
                if (file != null) {
                    //取得当前上传文件的文件名称
                    String myFileName = file.getOriginalFilename();
                    //如果名称不为“”,说明该文件存在，否则说明该文件不存在
                    if (myFileName.trim() != "") {
                        //定义上传路径
                        String path =  fileSavePath + fileSaveName;
                        MyFile.delete(path);
                        File localFile = new File(path);
                        try {
                            file.transferTo(localFile);
                        } catch (IOException e) {
                            throw new MyException("copy upload file error");
                        }
                    }
                }
            }
        }
    }

    public static String springMvcFileUpload(HttpServletRequest request, HttpServletResponse response, String fileSavePath) throws MyException {
        String fileName = null;
        //创建一个通用的多部分解析器
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(request.getSession().getServletContext());
        //判断 request 是否有文件上传,即多部分请求
        if (multipartResolver.isMultipart(request)) {
            //转换成多部分request
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
            //取得request中的所有文件名
            Iterator<String> iter = multiRequest.getFileNames();
            while (iter.hasNext()) {
                //取得上传文件
                MultipartFile file = multiRequest.getFile(iter.next());
                if (file != null) {
                    //取得当前上传文件的文件名称
                    String myFileName = file.getOriginalFilename();
                    fileName = myFileName;
                    //如果名称不为“”,说明该文件存在，否则说明该文件不存在
                    if (myFileName.trim() != "") {
                        //定义上传路径
                        String path =  fileSavePath + myFileName;
                        File localFile = new File(path);
                        try {
                            MyFile.delete(path);
                            file.transferTo(localFile);
                        } catch (IOException e) {
                            throw new MyException("copy upload file error:"+e.getMessage());
                        }
                    }
                }
            }
        }
        return fileName;
    }
}

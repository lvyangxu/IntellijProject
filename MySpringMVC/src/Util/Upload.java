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
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(request.getSession().getServletContext());
        if (multipartResolver.isMultipart(request)) {
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
            Iterator<String> iter = multiRequest.getFileNames();
            while (iter.hasNext()) {
                MultipartFile file = multiRequest.getFile(iter.next());
                if (file != null) {
                    String myFileName = file.getOriginalFilename();
                    if (myFileName.trim() != "") {
                        Path.create(fileSavePath);
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

    /**
     * get upload file and save it
     * @param request
     * @param response
     * @param fileSavePath
     * @return return fileName
     * @throws MyException
     */
    public static String springMvcFileUpload(HttpServletRequest request, HttpServletResponse response, String fileSavePath) throws MyException {
        String fileName = null;
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(request.getSession().getServletContext());
        if (multipartResolver.isMultipart(request)) {
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
            Iterator<String> iter = multiRequest.getFileNames();
            while (iter.hasNext()) {
                MultipartFile file = multiRequest.getFile(iter.next());
                if (file != null) {
                    String myFileName = file.getOriginalFilename();
                    fileName = myFileName;
                    if (myFileName.trim() != "") {
                        Path.create(fileSavePath);
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

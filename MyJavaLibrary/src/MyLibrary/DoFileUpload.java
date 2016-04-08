/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyLibrary;

import java.io.File;
import java.util.Iterator;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

/**
 *
 * @author anshifafeng
 */
public class DoFileUpload {
	
	DoIo DoIo1 = new DoIo();
    
    /**
     * 使用springMvc封装好的解析器上传文件
     * @param request HttpServletRequest对象
     * @param response HttpServletResponse对象
     * @param fileSavePath 上传的文件要保存的相对目录
     * @return 成功返回null,失败返回异常信息
     */
    public String springMvcFileUpload(HttpServletRequest request, HttpServletResponse response, String fileSavePath) throws Exception {
        String result = null;
		// 创建一个通用的多部分解析器
		CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(
				request.getSession().getServletContext());
		// 判断 request 是否有文件上传,即多部分请求
		if (multipartResolver.isMultipart(request)) {
			// 转换成多部分request
			MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
			// 取得request中的所有文件名
			Iterator<String> iter = multiRequest.getFileNames();
			while (iter.hasNext()) {
				// 取得上传文件
				MultipartFile file = multiRequest.getFile(iter.next());
				if (file != null) {
					// 取得当前上传文件的文件名称
					String myFileName = file.getOriginalFilename();
					// 如果名称不为“”,说明该文件存在，否则说明该文件不存在
					if (myFileName.trim() != "") {
						// 定义上传路径
						result = myFileName;
						String path = request.getServletContext().getRealPath("/") + "/" + fileSavePath + myFileName;
						File localFile = new File(path);
						file.transferTo(localFile);
					}
				}
			}

		}
		return result;
    }

    /**
     * 使用springMvc封装好的解析器上传文件
     * @param request HttpServletRequest对象
     * @param response HttpServletResponse对象
     * @param fileSavePath 上传的文件要保存的相对目录
     * @param fileSaveName 上传的文件要保存的名称
     * @return 成功返回null,失败返回异常信息
     */
    public String springMvcFileUpload(HttpServletRequest request, HttpServletResponse response, String fileSavePath,String fileSaveName) {
        String result = null;
        try {
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
                            String path = request.getServletContext().getRealPath("/") + "/" + fileSavePath + fileSaveName;
                            String deleteResult = DoIo1.deleteFileOrDirectory(path);
                            if(deleteResult!=null){
                            	return deleteResult;
                            }                            
                            File localFile = new File(path);
                            file.transferTo(localFile);
                        }
                    }
                }

            }
        } catch (Exception e) {
            result = e.getMessage();
        }
        return result;
    }    
}

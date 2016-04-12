/**
 * description 引用框架中的所有css和js
 * author lvyangxu
 * 2015-08-02
 */

//设置相对路径
var relativePath = "../Framework/";
var refernceString = "";

//引用css和js
function refernce(folderPath, filePathArr) {
    var result = "";
    for (var i = 0; i < filePathArr.length; i++) {
        var filePath = filePathArr[i];
        if (filePath.indexOf(".css") != -1) {
            result = result + "<link rel=\"stylesheet\" href=\"" + relativePath + folderPath + filePath + "\">";
        } else {
            result = result + "<script src=\"" + relativePath + folderPath + filePath + "\"></script>";
        }
    }
    return result;
}

//加载jquery
refernceString = refernceString+refernce("jquery/",["jquery-2.1.4.min.js"]);

//加载bootstrap
var bootstrapArr = ["bootstrap.min.css", "bootstrap-theme.min.css","bootstrap.min.js"];
refernceString = refernceString+refernce("bootstrap/",bootstrapArr);
//
//加载fontawesome
refernceString = refernceString+refernce("fontawesome/css/",["font-awesome.min.css"]);

//加载css
refernceString = refernceString+refernce("css/",["common.css"]);


var myJsPathArr = ["data-model.js", "image-model.js", "communication-model.js"];
refernceString = refernceString+refernce("js/",myJsPathArr);

//扩展
var extendArr = ["string.js","array.js","jquery.js"];
refernceString = refernceString+refernce("extend/",extendArr);

//输出所有引用的内容
document.write(refernceString);

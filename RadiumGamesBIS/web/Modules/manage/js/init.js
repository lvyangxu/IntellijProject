/**
 * load all framework
 */
{
    let relativePath = "../Framework/";
    let refernceString = "";

    /**
     * load js and css
     * @param folderPath
     * @param filePathArr
     * @returns {string}
     */
    let refernce = (folderPath, filePathArr)=> {
        var result = "";
        for (let filePath of filePathArr) {
            if (filePath.endsWith(".css")) {
                result += "<link rel=\"stylesheet\" href=\"" + relativePath + folderPath + filePath + "\">";
            } else {
                result += "<script src=\"" + relativePath + folderPath + filePath + "\"></script>";
            }
        }
        return result;
    }

    /**
     * load jquery
     */
    refernceString += refernce("jquery/", ["jquery-2.1.4.min.js"]);

    /**
     * load bootstrap
     */
    let bootstrapArr = ["bootstrap.min.css", "bootstrap-theme.min.css", "bootstrap.min.js"];
    refernceString += refernce("bootstrap/", bootstrapArr);

    /**
     * load fontawesome
     */
    refernceString += refernce("fontawesome/css/", ["font-awesome.min.css"]);

    /**
     * load common css
     */
    refernceString += refernce("css/", ["common.css"]);
    
    /**
     * load extend
     */
    let extendArr = ["array.js", "jquery.js"];
    refernceString += refernce("extend/", extendArr);

    /**
     * load util
     */
    let utilArr = ["cookie.js", "date.js", "http.js", "math.js", "myString.js", "websocket.js"];
    refernceString += refernce("util/", utilArr);

    /**
     * load addon
     */
    let loadAddon = (nameArr)=> {
        let result = "";
        for(let name of nameArr){
            let addonArr = [name + "/" + name + ".js", name + "/" + name + ".css"];
            result += refernce("addon/", addonArr);
        }
        return result;
    }
    refernceString += loadAddon(["nav","section","table","select","wall","datepicker","upload"]);

    /**
     * output all reference
     */
    document.write(refernceString);
}
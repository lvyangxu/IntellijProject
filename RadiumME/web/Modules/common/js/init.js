"use strict";

/**
 * load all framework
 */
{
    (function () {
        var relativePath = "../Framework/";
        var refernceString = "";

        /**
         * load js and css
         * @param folderPath
         * @param filePathArr
         * @returns {string}
         */
        var refernce = function refernce(folderPath, filePathArr) {
            var result = filePathArr.map(function (d) {
                if (d.endsWith(".css")) {
                    d = "<link rel=\"stylesheet\" href=\"" + relativePath + folderPath + d + "\">";
                } else {
                    d = "<script src=\"" + relativePath + folderPath + d + "\"></script>";
                }
                return d;
            }).join("");
            return result;
        };

        /**
         * load jquery
         */
        refernceString += refernce("jquery/", ["jquery-2.1.4.min.js"]);

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
        var extendArr = ["array.js", "jquery.js"];
        refernceString += refernce("extend/", extendArr);

        /**
         * load util
         */
        var utilArr = ["cookie.js", "date.js", "http.js", "math.js", "myString.js", "websocket.js"];
        refernceString += refernce("util/", utilArr);

        /**
         * load addon
         */
        var loadAddon = function loadAddon(nameArr) {
            var result = nameArr.map(function (d) {
                var addonArr = [d + "/" + d + ".js", d + "/" + d + ".css"];
                d = refernce("addon/", addonArr);
                return d;
            }).join("");
            return result;
        };
        refernceString += loadAddon(["nav", "section", "table", "select", "wall", "datepicker", "upload", "carousel"]);

        /**
         * output all reference
         */
        document.write(refernceString);
    })();
}

//# sourceMappingURL=init.js.map
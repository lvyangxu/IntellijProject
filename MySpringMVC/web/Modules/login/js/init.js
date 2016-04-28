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
            var result = "";
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = filePathArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var filePath = _step.value;

                    if (filePath.endsWith(".css")) {
                        result += "<link rel=\"stylesheet\" href=\"" + relativePath + folderPath + filePath + "\">";
                    } else {
                        result += "<script src=\"" + relativePath + folderPath + filePath + "\"></script>";
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return result;
        };

        /**
         * load jquery
         */
        refernceString += refernce("jquery/", ["jquery-2.1.4.min.js"]);

        /**
         * load bootstrap
         */
        var bootstrapArr = ["bootstrap.min.css", "bootstrap-theme.min.css", "bootstrap.min.js"];
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
        var extendArr = ["array.js", "jquery.js"];
        refernceString += refernce("extend/", extendArr);

        /**
         * load util
         */
        var utilArr = ["cookie.js", "date.js", "http.js", "math.js", "myString.js", "websocket.js"];
        refernceString += refernce("util/", utilArr);

        /**
         * output all reference
         */
        document.write(refernceString);
    })();
}

//# sourceMappingURL=init.js.map
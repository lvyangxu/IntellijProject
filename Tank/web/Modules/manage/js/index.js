"use strict";

{
    $(".table").table();

    $(".upload").delegate("", "click", function () {
        upload.do("../Code/Import", $("body").children("input"), function () {}).then(function (d) {
            alert("import success");
        }).catch(function (d) {
            alert("import failed:" + d);
        });
    });
}

//# sourceMappingURL=index.js.map
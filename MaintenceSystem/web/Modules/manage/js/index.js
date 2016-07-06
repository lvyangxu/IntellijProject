"use strict";

{
    spring.authenticate().then(function (result) {
        $(".table").table();
        $(".tree").tree();
        $(".tree").children(".level1[name=monitor]").delegate("", "click", function () {
            window.open("http://52.51.56.212/zabbix/");
        });
    }).catch(function (result) {});
}

//# sourceMappingURL=index.js.map
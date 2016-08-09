{

    spring.authenticate().then(result=> {
        $(".table").table();
        $(".tree").tree();
        $(".tree").xPath(".level1[name=monitor]>.level2[name=zabbix]").delegate("", "click", function () {
            window.open("http://52.51.56.212/zabbix/");
        });
    }).catch(result=> {
        console.log(result);
    }); 


}
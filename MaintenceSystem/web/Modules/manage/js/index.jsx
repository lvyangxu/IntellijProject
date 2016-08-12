{


    spring.authenticate().then(result=> {
        $(".table").table();
        $(".tree").tree();
        $(".tree").xPath(".level1[name=monitor]>.level2[name=zabbix]").delegate("", "click", function () {
            window.open("http://52.51.56.212/zabbix/");
        });
        // ReactDOM.render(
        //     <h1>afsfasfs</h1>,
        //     document.getElementsByClassName("tree-panel")[0]
        // );
    }).catch(result=> {
        console.log(result);
    });

    // var React = require('react');
    // var ReactDOM = require('react-dom');

    // let chart = require('../../../Component/chart/chart');

}
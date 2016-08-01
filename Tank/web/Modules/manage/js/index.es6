{
    $(".table").table();

    $(".upload").delegate("","click",function () {
        upload.do("../Code/Import",$("body").children("input"),()=>{}).then(d=>{
            alert("import success")
        }).catch(d=>{
            alert("import failed:"+d);
        });
    });

}
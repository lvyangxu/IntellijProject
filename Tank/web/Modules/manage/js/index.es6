{
    $(".table").table();

    $(".upload").delegate("", "click", function () {
        upload.do("../Code/Import", $(".import").children("input"), ()=> {
        }).then(d=> {
            alert("import success")
        }).catch(d=> {
            alert("import failed:" + d);
        });
    });

    $(".reserve").children("button").delegate("", "click", function () {
        let requestData = "";
        if (!$(this).hasClass("all")) {
            let v = $(".reserve").children("input").val();
            if (v == "") {
                alert("lack of email");
                return;
            }

            requestData = "email=" + v.split(",").map(d=> {
                    d = new myString(d).base64UrlEncode().value;
                    return d; 
                }).join(",");
        }
        http.request("../Broadcast/SendMail", requestData).then(result=> {
            let message = "all:" + result.all + ",success:" + result.success;
            alert(message);
        }).catch(result=> {
            alert(result);
        });
    });

}
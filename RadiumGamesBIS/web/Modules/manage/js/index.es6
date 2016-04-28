{

    $("#Business").section();
    $("#Finance").section();

    $("body").delegate("", "click", function (event) {
        $(".addon-datepicker").children(".contain").children(".panel").hide();
        $(".addon-wall").children(".contain").children(".panel").hide();
        $(".addon-select").children(".contain").children(".panel").hide();
        $(".addon-upload").children(".contain").children(".panel").hide();
    });

    $(".nav").nav();
    $(".addon-datepicker").datepicker();
    $(".addon-table").table();
    $(".addon-upload").upload();

    $("#excelModel").delegate("", "click", function () {
        window.location.href = "../ApplicationData/excel/model/周报批量录入模版.xlsx";
    });

    $("#channelinfo").table({
        "beforeCreateOpenCallback": function beforeCreateOpenCallback(successCallback) {
            http.request("../Table/channelmanager/Read", "").then(function (result) {
                result = result.map(function (d) {
                    return d.username;
                });
                $("#channelinfo").data({
                    "th-data": {
                        "type1": ["CPI", "Fixed CPI", "Flat Fee", "Service Fee"],
                        "type2": ["Network", "Affiliate", "Self-managed Network"],
                        "manager": result
                    }
                });
                successCallback();
            }, function (result) {
                alert("渠道负责人列表加载失败");
            });
        },
        "beforeUpdateOpenCallback": function beforeUpdateOpenCallback(successCallback) {
            http.request("../Table/channelmanager/Read", "").then(function (result) {
                result = result.map(function (d) {
                    return d.username;
                });
                $("#channelinfo").data({
                    "th-data": {
                        "type1": ["CPI", "Fixed CPI", "Flat Fee", "Service Fee"],
                        "type2": ["Network", "Affiliate", "Self-managed Network"],
                        "manager": result
                    }
                });
                successCallback();
            }, function (result) {
                alert("渠道负责人列表加载失败");
            });
        }
    });

    $("#channeldetail").data({
        "th-data": {
            "app": ["FR", "DE", "RU", "EN"],
            "client": ["ios", "android"]
        }
    });

    $("#channelweeklyreporttotal").table({
        "requestFilterData": {
            "app": [{ "checked": true, "name": "FR" }, { "checked": true, "name": "DE" }, { "checked": true, "name": "RU" }, { "checked": true, "name": "EN" }]
        },
        "read": ""
    });

    $("#channelweeklyreport").data({
        "th-data": {
            "isvalid": ["true", "false"],
            "app": ["FR", "DE", "RU", "EN"],
            "area": ["FR", "DE", "RU", "EN"],
            "client": ["ios", "android"],
            "type": ["CPI", "Fixed CPI", "Flat Fee", "Service Fee"]
        }
    });
    $("#channelweeklyreport").table({
        "beforeCreateOpenCallback": function beforeCreateOpenCallback(successCallback) {
            http.request("../Table/channellist/Read", "").then(function (result) {
                var oldData = $("#channelweeklyreport").data("th-data");
                var nameArr = result.map(function (d) {
                    return d.name;
                });
                var newData = { "name": nameArr };
                $.extend(oldData, newData);
                $("#channelweeklyreport").data("th-data", oldData);
                successCallback();
            }, function (result) {
                alert("渠道列表加载失败");
            });
        },
        "beforeUpdateOpenCallback": function beforeUpdateOpenCallback(successCallback) {
            http.request("../Table/channellist/Read", "").then(function (result) {
                var oldData = $("#channelweeklyreport").data("th-data");
                var nameArr = result.map(function (d) {
                    return d.name;
                });
                var newData = { "name": nameArr };
                $.extend(oldData, newData);
                $("#channelweeklyreport").data("th-data", oldData);
                successCallback();
            }, function (result) {
                alert("渠道列表加载失败");
            });
        }
    });

    $("#weeklystatistics").table({
        "requestFilterData": {
            "app": [{ "checked": true, "name": "FR" }, { "checked": true, "name": "DE" }, { "checked": true, "name": "RU" }, { "checked": true, "name": "EN" }]
        },
        "read": ""
    });

    $("#monthlystatistics").table({
        "requestFilterData": {
            "app": [{ "checked": true, "name": "FR" }, { "checked": true, "name": "DE" }, { "checked": true, "name": "RU" }, { "checked": true, "name": "EN" }]
        },
        "read": ""
    });

    $("#kpi").data({
        "th-data": {
            "app": ["FR", "DE", "RU", "EN"]
        }
    });

    $("#invoicedetail").data({
        "th-data": {
            "area": ["FR", "DE", "RU", "EN"],
            "client": ["ALL", "ios", "android"],
            "app": ["FR", "DE", "RU", "EN"],
            "paystate": ["paid", "unpaid"]
        }
    });

    $("#invoicedetail").table({
        "beforeCreateOpenCallback": function beforeCreateOpenCallback(successCallback) {
            http.request("../Table/channellist/Read", "").then(function (result) {
                var oldData = $("#invoicedetail").data("th-data");
                var nameArr = result.map(function (d) {
                    return d.name;
                });
                var newData = { "name": nameArr };
                $.extend(oldData, newData);
                $("#invoicedetail").data("th-data", oldData);
                http.request("../Table/invoicedetailtemp/AttachmentTempIndex", "").then(function (result) {
                    $("#invoicedetail").data("AttachmentTempIndex", result);
                    successCallback();
                }, function (result) {
                    alert("附件临时id获取失败");
                });
            }, function (result) {
                alert("渠道列表加载失败");
            });
        },
        "beforeUpdateOpenCallback": function beforeUpdateOpenCallback(successCallback) {
            http.request("../Table/channellist/Read", "").then(function (result) {
                var oldData = $("#invoicedetail").data("th-data");
                var nameArr = result.map(function (d) {
                    return d.name;
                });
                var newData = { "name": nameArr };
                $.extend(oldData, newData);
                $("#invoicedetail").data("th-data", oldData);
                successCallback();
            }, function (result) {
                alert("渠道列表加载失败");
            });
        }
    });

    $(document).keydown(function (e) {
        var keyEvent;
        if (e.keyCode == 8) {
            var d = e.srcElement || e.target;
            if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') {
                keyEvent = d.readOnly || d.disabled;
            } else {
                keyEvent = true;
            }
        } else {
            keyEvent = false;
        }
        if (keyEvent) {
            e.preventDefault();
        }
    });
}

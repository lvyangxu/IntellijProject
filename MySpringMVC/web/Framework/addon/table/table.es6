/**
 * table js
 */
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function ($) {
    "use strict";
    $.fn.table = function (options) {
        return this.each(function () {
            table($(this), options);
        });
    };

    let table = function (element, options) {

        let requestFilterKeyArr = element.property("request-filter-key", "").split(",");
        let requestFilterNameArr = element.property("request-filter-name", "").split(",");
        let requestFilter = [];
        for (var i = 0; i < requestFilterKeyArr.length; i++) {
            if (requestFilterKeyArr[i] != "") {
                requestFilter.push([requestFilterKeyArr[i], requestFilterNameArr[i]]);
            }
        }
        let settings = element.addonSettingExtend(options, {
            "id": element.attr("id"),
            "title": element.property("title", ""),
            "columnDateKey": element.property("column-date-key", ""),
            "dateFilterType": element.attr("date-filter-type"),
            "dataStartAddNum": element.property("date-start-add-num", (element.attr("month") == "month") ? 0 : -14),
            "dateEndAddNum": element.property("date-end-add-num", 0),
            "url": element.property("url", "../Table/" + element.attr("id") + "/"),
            "curd": element.property("curd", "curd"),
            "attachment": element.has("attachment"),
            "attachmentBatchDownload": element.has("attachmentBatchDownload"),
            "createWithAttachment": element.has("createWithAttachment"),
            "relateCreate": element.has("relateCreate"),
            "relate": element.property("relate", ""),
            "related": element.property("related", ""),
            "requestFilterKey": requestFilter
        });

        //colspan add num
        let colspanAddNum = 1;
        colspanAddNum = relate ? (colspanAddNum + 1) : colspanAddNum;
        colspanAddNum = attachment ? (colspanAddNum + 1) : colspanAddNum;

        let node = {
            "table": element.children("table"),
            "content": element.xPath("table>thead,tbody>tr>.content"),
            "thead": element.xPath("table>thead"),
            "theadContent": element.xPath("table>thead>tr>.content"),
            "tbody": element.xPath("table>tbody"),
            "tbodyRow": element.xPath("table>tbody>tr"),
            "theadCheckbox": element.xPath("table>thead>tr>.pre>input[type=checkbox]"),
            "tbodyCheckbox": element.xPath("table>tbody>tr>.pre>input[type=checkbox]"),
            "initSpan": element.children("span"),
            "columnFilter": element.xPath(".filter>.column-filter"),
            "rowFilter": element.xPath(".filter>.row-filter"),
            "rowFilterBodyDiv":element.xPath(".filter>.row-filter>.contain>.panel>.body>div"),
            "rowFilterHead":element.xPath(".filter>.row-filter>.contain>.panel>.head"),
            "rowFilterBody":element.xPath(".filter>.row-filter>.contain>.panel>.body"),
            "createHead":element.xPath(".request>.create>.contain>.panel>.head"),
            "createBody":element.xPath(".request>.create>.contain>.panel>.body"),
            "updateHead":element.xPath(".request>.update>.contain>.panel>.head"),
            "updateBody":element.xPath(".request>.update>.contain>.panel>.body"),
            "relateCreateHead":$("#" + settings.related).xPath(".request>.relateCreate>.contain>.panel>.head"),
            "relateCreateBody":$("#" + settings.related).xPath(".request>.relateCreate>.contain>.panel>.body"),
            "filter":element.children(".filter"),
            "request":element.children(".request"),
            "pagination":element.children(".pagination")
        };

        let func = {
            loading(){
                let columnFilterData = node.columnFilter.data("data");
                if (columnFilterData != undefined) {
                    let l = columnFilterData.filter((d)=> {
                        return d.checked;
                    }).length;
                    let currentColumnLength = l + colspanAddNum;
                    node.tbody.html("<tr><td colspan='" + currentColumnLength + "'><i class='animation fa fa-refresh'></i></td></tr>");
                }
            },
            noData(){
                let columnFilterData = node.columnFilter.data("data");
                if (columnFilterData != undefined) {
                    let l = columnFilterData.filter((d)=> {
                        return d.checked;
                    }).length;
                    let currentColumnLength = l + colspanAddNum;
                    node.tbody.html("<tr><td colspan='" + currentColumnLength + "'>There is not any matched data for last request</i></td></tr>");
                }
            },
            fail(message){
                let columnFilterData = node.columnFilter.data("data");
                if (columnFilterData != undefined) {
                    let l = columnFilterData.filter((d)=> {
                        return d.checked;
                    }).length;
                    let currentColumnLength = l + colspanAddNum;
                    node.tbody.html("<tr><td colspan='" + currentColumnLength + "'>Request Failed: " + message + "</td></tr>");
                }
            },
            read(requestUrl, requestData){
                this.loading();
                //refresh parent related data
                if (settings.relate != "") {
                    node.request.children(".request-filter").each(function () {
                        let thisSelect = $(this);
                        let selectId = requestFilter.filter(function (d) {
                            d = (d[1] == thisSelect.attr("title"));
                            return d;
                        }).map(function (d) {
                            return d[0];
                        }).collect("join", "");
                        var oldData = $("#" + relate).data("parentRelatedData");
                        var newData = new Object();
                        newData[selectId] = thisSelect.data("data");
                        $.extend(oldData, newData);
                        $("#" + relate).data("parentRelatedData", oldData);
                    });
                }
                //add relatedData to requestParam
                var relatedRequestData = (setting.related != "") ? data("relatedData") : "";
                requestData = (requestData == undefined) ? relatedRequestData : (requestData + "&" + relatedRequestData);
                if (requestFilter.length > 0) {
                    requestData += (requestData == "") ? "" : "&";
                    requestData += node("request").children(".request-filter").toArray().map(function (d) {
                        if ($(d).data("data") == undefined) {
                            return "";
                        }
                        var selectId = requestFilter.filter(function (d1) {
                            return (d1[1] == $(d).attr("title"));
                        }).map(function (d1) {
                            return d1[0];
                        }).collect("join", "");

                        d = selectId + "=" + $(d).data("data").filter(function (d1) {
                                return d1.checked;
                            }).map(function (d1) {
                                return new myString(d1.name).base64UrlEncode().value;
                            }).collect("join", ",");
                        return d;
                    }).collect("join", "&");
                }
                //add parentRelatedData to requestParam
                if (data("parentRelatedData") != undefined) {
                    requestData += "&";
                    for (var key in data("parentRelatedData")) {
                        var v = data("parentRelatedData")[key].filter(function (d) {
                            return d.checked;
                        }).map(function (d) {
                            return new myString(d1.name).base64UrlEncode().value;
                        }).collect("join", ",");
                        requestData += key + "=" + v + "&";
                    }
                    requestData = requestData.substr(0, requestData.length - 1);
                }

                requestUrl = (requestUrl == undefined || requestUrl == "") ? url : requestUrl;
                http.request(requestUrl + "Read", requestData).then(function (result) {
                    data("setData")(result);
                    data("pageIndex", 0);
                    data("refreshDisplay")();
                }, function (result) {
                    if (result.startsWith("relogin:")) {
                        window.location.href = "../login/";
                    } else {
                        data("fail")();
                    }

                });
            }
        }

        element.addonInit("table", ()=> {

        });



        //init
        if (!data("init")) {

            //refresh attachment
            data("refreshAttachment", function (attachmentTbody, columnKeyValueArr) {
                var requestData = data("thArr").filter(function (d) {
                    return d.key;
                }).map(function (d) {
                    d = d.id + "=" + columnKeyValueArr.filter(function (d1) {
                            return (d1.split("=")[0] == d.id);
                        }).map(function (d1) {
                            return d1.split("=")[1];
                        }).collect("join", "");
                    return d;
                }).collect("join", "&");
                var currentKey = columnKeyValueArr.map(function (d) {
                    return d.split("=")[1];
                }).collect("join", "_");
                http.request(url + "AttachmentList", "key=" + currentKey).then(function (result) {
                    var attachmentReadBodyHtml = (result.length == 0) ? "<tr><td colspan='5'>no attachment</td></tr>" : (result.map(function (d) {
                        var size = (d.size > 1024 * 1024) ? ((d.size / 1024 / 1024).toFixed(2) + "M") : ((d.size / 1024).toFixed(2) + "KB");
                        d = "<tr><td><input type='checkbox'></td><td class='name'>" + d.name + "</td><td>" + size + "</td><td><i class='fa fa-download'></i></td><td><i class='fa fa-eye'></i></td></tr>";
                        return d;
                    }).collect("join", ""));
                    attachmentTbody.html(attachmentReadBodyHtml);
                    //download attachement
                    attachmentTbody.children("tr").children("td").children(".fa-download").delegate("", "click", function () {
                        var attachmentName = $(this).parent().parent().children(".name").text();
                        window.location.href = url + "AttachmentDownload/" + currentKey + "?fileName=" + attachmentName;
                    });
                    //preview
                    attachmentTbody.children("tr").children("td").children(".fa-eye").delegate("", "click", function () {
                        var attachmentName = $(this).parent().parent().children(".name").text();
                        var keyTemp = currentKey;
                        window.open("../Upload/" + id + "/" + keyTemp.decode("url").decode("base64") + "/" + attachmentName);
                    });

                }, function (result) {
                    alert("get AttachmentList failed：" + result);
                });
            });
            //set table data
            data("setData", function (d) {
                data("data", d);
                var sourceData = [];
                for (var i = 0; i < d.length; i++) {
                    sourceData.push(d[i]);
                }
                data("sourceData", sourceData);
                data("filterColumnData", d);
            });
            //set current page html
            data("setCurrentPageHtml", function () {
                if (data("filterColumnData") == undefined) {
                    return;
                }
                var startPageIndex = data("pageIndex") * data("rowsPerPage");
                var endPageIndex = (data("pageIndex") + 1) * data("rowsPerPage");
                var rowIndex = 0;
                var displayHtmlArr = data("filterColumnData").map(function (d) {
                    var result = "<tr row-index='" + rowIndex + "'>";
                    result += "<td class='pre'><input type='checkbox'></td>";
                    var attachmentHtml = (attachment != "") ? "<td class='pre'><div class='attachment addon-wall' icon='paperclip' iconOnly></td>" : "";
                    result += attachmentHtml;
                    var relateHtml = (relate != "") ? "<td class='pre'><i class='relate fa fa-plus'></i></td>" : "";
                    result += relateHtml;
                    result += data("thArr").map(function (d1) {
                        var value = "";
                        if (d[d1.id] != undefined) {
                            value = d[d1.id];
                        }
                        var hideHtml = d1.checked ? "" : " hide";
                        var result1 = "<td th-id='" + d1.id + "' class='content" + hideHtml + "'>" + value + "</td>";
                        return result1;
                    }).collect("join", "");
                    result += "</tr>";
                    rowIndex++;
                    return result;
                }).slice(startPageIndex, endPageIndex);
                var displayData = data("filterColumnData").slice(startPageIndex, endPageIndex);
                data("displayData", displayData);
                var tbodyHtml = displayHtmlArr.collect("join", "");
                data("displayHtmlArr", displayHtmlArr);
                node("tbody").html(tbodyHtml);
                $(".addon-wall").wall();
                //attachment click callback
                node("tbody").children("tr").children(".pre").children(".attachment").children(".contain").children(".switch").delegate("", "click", function () {
                    var thisAttachmentIcon = $(this).parent().parent();
                    var columnKeyValueArr = data("thArr").filter(function (d) {
                        return d.key;
                    }).map(function (d) {
                        d = d.id + "=" + new myString(thisAttachmentIcon.parent().parent().children("td[th-id=" + d.id + "]").text()).base64UrlEncode().value;
                        return d;
                    });

                    var attachmentWallHtml = "<div class='head'>";
                    attachmentWallHtml += "<button class='refresh btn btn-warning'><i class='fa fa-refresh'></i></button>";
                    attachmentWallHtml += "<div class='addon-upload' title='upload attachment' url='../Table/" + id + "/AttachmentUpload' postData='key=" + columnKeyValueArr.map(function (d) {
                            return d.split("=")[1];
                        }).collect("join", "_") + "'></div>";
                    attachmentWallHtml += "<button class='delete btn btn-danger'><i class='fa fa-times'></i></button>";
                    attachmentWallHtml += "</div>";
                    attachmentWallHtml += "<div class='body'>";
                    attachmentWallHtml += "<table class='table table-bordered table-condensed table-hover'>";
                    attachmentWallHtml += "<thead><tr><th><input type='checkbox'></th><th class='content'>name</th><th class='content'>size</th><th>download</th><th>preview</th></tr></thead>";
                    attachmentWallHtml += "<tbody>";
                    attachmentWallHtml += "</tbody>";
                    attachmentWallHtml += "</table>";
                    attachmentWallHtml += "</div>";
                    thisAttachmentIcon.wall({"html": attachmentWallHtml});
                    var attachmentTbody = thisAttachmentIcon.children(".contain").children(".panel").children(".body").children("table").children("tbody");
                    data("refreshAttachment")(attachmentTbody, columnKeyValueArr);

                    thisAttachmentIcon.children(".contain").children(".panel").children(".head").children(".addon-upload").upload({
                        "hideCallback": function () {
                            data("refreshAttachment")(attachmentTbody, columnKeyValueArr);
                        }
                    });

                    //attachment list refresh
                    thisAttachmentIcon.children(".contain").children(".panel").children(".head").children(".refresh").delegate("", "click", function () {
                        data("refreshAttachment")(attachmentTbody, columnKeyValueArr);
                    });
                    //attachment delete
                    thisAttachmentIcon.children(".contain").children(".panel").children(".head").children(".delete").delegate("", "click", function () {
                        var thisTrs = $(this).parent().parent().children(".body").children("table").children("tbody").children("tr");
                        var deleteNameArr = [];
                        thisTrs.each(function () {
                            if ($(this).children("td").children("input[type=checkbox]").prop("checked")) {
                                deleteNameArr.push($(this).children(".name").text());
                            }
                        });
                        if (deleteNameArr.length == 0) {
                            alert("请至少勾选一个附件");
                            return;
                        }

                        if (confirm("你确定要删除勾选的" + deleteNameArr.length + "个附件吗？")) {
                            http.request(url + "AttachmentDelete", "key=" + columnKeyValueArr.map(function (d) {
                                    return d.split("=")[1];
                                }).collect("join", "_") + "&name=" + deleteNameArr.map(function (d) {
                                    return new myString(d).base64UrlEncode().value;
                                }).collect("join", ",")).then(function (result) {
                                data("refreshAttachment")(attachmentTbody, columnKeyValueArr);
                            }, function (result) {
                                alert("get AttachmentList failed：" + result);
                            });
                        }
                    });


                });

                //relate click callback
                node("tbody").children("tr").children(".pre").children(".relate").delegate("", "click", function () {
                    $(this).parent().parent().siblings().fadeToggle("slow");
                    var relateIcon = $(this);
                    node("pagination").fadeToggle("fast", function () {
                        node("filter").fadeToggle("fast", function () {
                            node("request").fadeToggle("fast", function () {
                                if (relateIcon.hasClass("fa-plus")) {
                                    relateIcon.addClass("fa-minus");
                                    relateIcon.removeClass("fa-plus");
                                    $("#" + relate).toggle("fast", function () {
                                        var relatedData = data("thArr").filter(function (d) {
                                            return d.key;
                                        }).map(function (d) {
                                            d = d.id + "=" + new myString(relateIcon.parent().parent().children(".content[th-id=" + d.id + "]").text()).base64UrlEncode().value;
                                            return d;
                                        }).collect("join", "&");
                                        $(this).table({
                                            "read": "../Table/" + relate + "/",
                                            "relatedData": relatedData
                                        })
                                    });
                                } else {
                                    relateIcon.addClass("fa-plus");
                                    relateIcon.removeClass("fa-minus");
                                    //refresh data
                                    data("Read")();
                                    $("#" + relate).toggle("fast");
                                }
                            });
                        });
                    });
                });
            });
            //set current page display
            data("refreshDisplay", function () {
                data("setCurrentPageHtml")();
                if (data("filterColumnData") == undefined) {
                    data("noData")();
                    return;
                }
                var pageLength = parseInt((data("filterColumnData").length - 1) / data("rowsPerPage"));
                var start;
                if (data("pageIndex") <= 2) {
                    start = 0;
                } else if (data("pageIndex") >= pageLength - 2) {
                    start = pageLength - 4;
                } else {
                    start = data("pageIndex") - 2;
                }
                var arr = [];
                for (var i = start; i <= start + 4; i++) {
                    if (i < 0) {
                        continue;
                    }
                    if (i > pageLength) {
                        break;
                    }
                    arr.push(i);
                }
                var paginationButtonHtml = arr.map(function (d) {
                    var btnClass = (d == data("pageIndex")) ? "btn-success" : "btn-info";
                    d = "<button class='btn " + btnClass + "'>" + (d + 1) + "</button>";
                    return d;
                }).collect("join", "");
                node("pagination").children("span").html(paginationButtonHtml);

                //pagination button click event
                node("pagination").children("span").children("button").delegate("", "click", function (event) {
                    node("thead-checkbox").prop("checked", false);
                    data("pageIndex", parseInt($(this).text()) - 1);
                    data("refreshDisplay")();
                });

                //listen tbody checkbox
                node("tbody-checkbox").delegate("", "click", function () {
                    if ($(this).prop("checked")) {
                        $(this).parent(".pre").parent("tr").addClass("info");
                    } else {
                        $(this).parent(".pre").parent("tr").removeClass("info");
                    }
                });
                node("row-filter-body").html("");
            });
            //data sort
            data("sort", function (thisElement) {
                var sortId = thisElement.attr("th-id");
                if (thisElement.children("i").hasClass("fa-sort-asc")) {
                    //sort asc to no sort
                    data("setData")(data("sourceData"));
                    thisElement.children("i").removeClass("fa fa-sort-asc");
                    thisElement.children("i").addClass("fa fa-sort");
                } else if (thisElement.children("i").hasClass("fa-sort-desc")) {
                    //sort desc to asc
                    data("data").sort(function (a, b) {
                        var va = isNaN(parseFloat(a[sortId])) ? a[sortId] : parseFloat(a[sortId]);
                        var vb = isNaN(parseFloat(b[sortId])) ? b[sortId] : parseFloat(b[sortId]);
                        return va < vb ? 1 : -1;
                    });
                    thisElement.children("i").removeClass("fa fa-sort-desc");
                    thisElement.children("i").addClass("fa fa-sort-asc");
                } else {
                    //set other th no sort
                    thisElement.parent().children(".content").children("i").attr("class", "fa fa-sort");

                    //no sort to desc
                    data("data").sort(function (a, b) {
                        var va = isNaN(parseFloat(a[sortId])) ? a[sortId] : parseFloat(a[sortId]);
                        var vb = isNaN(parseFloat(b[sortId])) ? b[sortId] : parseFloat(b[sortId]);
                        return va > vb ? 1 : -1;
                    });
                    thisElement.children("i").removeClass("fa fa-sort");
                    thisElement.children("i").addClass("fa fa-sort-desc");
                }

                data("refreshDisplay")();
            });

            //get request td data by td type
            var getRequestTdData = function (td, type) {
                var result = "";
                switch (type) {
                    case "multi-select":
                        result = td.children(".addon-select").data("data").filter(function (d) {
                            return d.checked;
                        }).map(function (d) {
                            return d.name;
                        }).collect("join", ",");
                        break;
                    case "text":
                    case "int":
                    case "float":
                        result = td.children("input").val();
                        break;
                    case "single-select":
                        result = td.children("select").val();
                        break;
                    case "month":
                        result = td.children(".addon-datepicker").data("data");
                        result = (result.length == 7) ? (result + "-01") : result;
                        break;
                    case "week":
                    case "day":
                        result = td.children(".addon-datepicker").data("data");
                        break;
                    default:
                        result = null;
                        break;
                }
                return result;
            };
            //get request td html by td type
            var getRequestTdHtml = function (d, v) {
                var result = "";
                var defaultValue = "";
                var readonlyHtml = ((d.readonly || d.updateReadonly) && v != undefined) ? " readonly" : "";
                var keyHtml = (d.key && v != undefined) ? " readonly" : "";
                switch (d.type) {
                    case "single-select":
                        if (data("th-data") != undefined) {
                            result = data("th-data")[d.id];
                            if (result != undefined) {
                                result = result.map(function (d1) {
                                    if (v != undefined) {
                                        defaultValue = (d1 == v) ? " selected='selected'" : "";
                                    }
                                    d1 = "<option" + defaultValue + ">" + d1 + "</option>";
                                    return d1;
                                }).collect("join", "");
                            }
                        }
                        if ((d.readonly || d.updateReadonly) && v != undefined) {
                            readonlyHtml += " onfocus='this.defaultIndex=this.selectedIndex;' onchange='this.selectedIndex=this.defaultIndex;'";
                        }
                        result = "<select class='form-control'" + readonlyHtml + keyHtml + ">" + result + "</select>";
                        break;
                    case "multi-select":
                        if (data("th-data") != undefined) {
                            defaultValue = (v == undefined) ? "" : " data='" + v + "'";
                            result = "<div" + readonlyHtml + " class='addon-select'" + defaultValue + "></div>";
                        }
                        break;
                    case "week":
                    case "month":
                    case "day":
                        defaultValue = (v == undefined) ? "" : " value='" + v + "'";
                        result = "<div" + readonlyHtml + " class='addon-datepicker' type='" + d.type + "' " + defaultValue + "></div>";
                        break;
                    case "int":
                    case "float":
                        defaultValue = (v == undefined) ? "" : " value='" + v + "'";
                        var minHtml = (d.numMin == undefined) ? "" : " min='" + d.numMin + "'";
                        var maxHtml = (d.numMax == undefined) ? "" : " max='" + d.numMax + "'";
                        var step = (d.type == "int") ? "1" : "0.01";
                        result = "<input class='form-control'" + readonlyHtml + defaultValue + keyHtml + " type='number' step='" + step + "'" + minHtml + maxHtml + ">";
                        break;
                    //text
                    default:
                        defaultValue = (v == undefined) ? "" : " value='" + v + "'";
                        result = "<input class='form-control'" + readonlyHtml + defaultValue + keyHtml + ">";
                        break;
                }
                result = "<td th-id='" + d.id + "'>" + result + "</td>";
                return result;
            };

            (function () {
                //get init data
                var thArr = [];
                node("init-span").each(function () {
                    var thId = $(this).attr("th-id");
                    var thName = $(this).text();
                    var checked = ($(this).attr("hide") != "");
                    var key = ($(this).attr("key") == "");
                    var type = $(this).attr("type");
                    //default set min length 1
                    var min = ($(this).attr("min") == undefined) ? 1 : $(this).attr("min");
                    //default set max length 50
                    var max = ($(this).attr("max") == undefined) ? 50 : $(this).attr("max");
                    var unsigned = ($(this).attr("unsigned") == "");
                    //default set min num 0 if not unsigned
                    var numMin = (!unsigned) ? 0 : undefined;
                    numMin = ($(this).attr("num-min") == undefined) ? numMin : $(this).attr("num-min");
                    var numMax = $(this).attr("num-max");
                    var readonly = ($(this).attr("readonly") == "readonly");
                    var noCreate = ($(this).attr("noCreate") == "");
                    var updateReadonly = ($(this).attr("updateReadonly") == "");

                    thArr.push({
                        "id": thId,
                        "name": thName,
                        "checked": checked,
                        "type": type,
                        "min": min,
                        "max": max,
                        "key": key,
                        "unsigned": unsigned,
                        "numMin": numMin,
                        "numMax": numMax,
                        "readonly": readonly,
                        "noCreate": noCreate,
                        "updateReadonly": updateReadonly
                    });
                });
                data("thArr", thArr);
                data("setting", setting);

                // build thead
                element.append(function () {
                    var headHtml = "<div><header>" + title + "</header></div>";
                    var requestHtml = "<div class='request'><label>Request</label>";
                    if (requestFilter.length > 0) {
                        requestHtml += requestFilter.map(function (d) {
                            d = "<div class='request-filter addon-select' title='" + d[1] + "'></div>";
                            return d;
                        }).collect("join", "");
                    }
                    requestHtml += "<button class='refresh btn btn-warning'><i class='fa fa-refresh'></i></button>";
                    requestHtml += "<button class='download btn btn-warning'><i class='fa fa-download'></i></button>";
                    requestHtml += (curd.indexOf("c") == -1) ? "" : "<div class='create addon-wall' button-class='warning' icon='plus'></div>";
                    requestHtml += (curd.indexOf("u") == -1) ? "" : "<div class='update addon-wall' button-class='warning' icon='pencil-square-o'></div>";
                    requestHtml += (curd.indexOf("d") == -1) ? "" : "<button class='delete btn btn-danger'><i class='delete fa fa-times'></i></button>";
                    if (setting.relateCreate) {
                        requestHtml += "<div class='relateCreate addon-wall' button-class='warning' icon='plus'></div>";
                    }
                    if (setting.attachmentBatchDownload) {
                        requestHtml += "<button class='attachmentBatchDownload btn btn-warning'><i class='fa fa-paperclip'></i></button>";
                    }

                    requestHtml += "</div>";
                    var filters = "<div class='column-filter addon-select' title='列'></div>";
                    filters += "<div class='row-filter addon-wall' title='行'></div>";
                    var filterHtml = "<div class='filter'><label>Filter</label>" + filters + "<button class='filter btn btn-info'><i class='fa fa-filter'></i>filter</button></div>";
                    var paginationHtml = "<div class='pagination'><label>Pagination</label>";
                    paginationHtml += "<select>";
                    for (var i = 5; i <= 25; i = i + 5) {
                        var selectedHtml = (i == 10) ? " selected='selected'" : "";
                        paginationHtml += "<option" + selectedHtml + ">" + i + "</option>";
                    }
                    paginationHtml += "</select>行/页";
                    paginationHtml += "<button class='double-left btn btn-info'><i class='fa fa-angle-double-left'></i></button>";
                    paginationHtml += "<button class='left btn btn-info'><i class='fa fa-angle-left'></i></button>";
                    paginationHtml += "<span><button class='btn btn-info'>1</button></span>";
                    paginationHtml += "<button class='right btn btn-info'><i class='fa fa-angle-right'></i></button>";
                    paginationHtml += "<button class='double-right btn btn-info'><i class='fa fa-angle-double-right'></i></button>";
                    paginationHtml += "</div>";
                    headHtml = headHtml + requestHtml + filterHtml + paginationHtml;
                    var relateHtml = (relate != "") ? "<th class='pre'>relate</th>" : "";
                    var attachmentHtml = (attachment != "") ? "<th class='pre'>attachment</th>" : "";
                    var theadHtml = "<thead><tr><th class='pre'><input type='checkbox'></th>" + attachmentHtml + relateHtml;
                    theadHtml += data("thArr").map(function (d) {
                        var hideHtml = d.checked ? "" : " hide";
                        var d1 = "<th class='content" + hideHtml + "' th-id='" + d.id + "'><i class='fa fa-sort'></i>" + d.name + "</th>";
                        return d1;
                    }).collect("join", "");
                    theadHtml += "</tr></thead>";
                    var innerHtml = headHtml + "<table class='table table-bordered table-condensed table-hover'>" + theadHtml + "<tbody></tbody></table>";
                    return innerHtml;
                });

                //if related,hide first
                if (setting.related != "") {
                    element.hide();
                } else {
                    //read data first
                    data("Read")(url);
                }

                //request filter select init
                node("request").children(".request-filter").select();

                //create wall
                node("request").children(".create").wall({
                    "html": function () {
                        var createHtml = "<div class='head'>";
                        createHtml += "<button class='add btn btn-info'><i class='fa fa-plus'></i></button>";
                        createHtml += "<button class='minus btn btn-warning'><i class='fa fa-minus'></i></button>";
                        createHtml += "<button class='remove btn btn-danger'><i class='fa fa-times'></i></button>";
                        createHtml += "<button class='submit btn btn-warning'><i class='fa fa-fa-floppy-o'></i>submit</button>";
                        createHtml += "</div>";
                        createHtml += "<div class='body'>";
                        createHtml += "<table class='table table-bordered table-condensed table-hover'><thead><tr>";
                        //attachment
                        if (setting.createWithAttachment) {
                            createHtml += "<td><div>attachment</div></td>";
                        }
                        //filter readonly
                        createHtml += data("thArr").filter(function (d) {
                            return !d.readonly;
                        }).filter(function (d) {
                            return !d.noCreate;
                        }).map(function (d) {
                            d = "<td><div>" + d.name + "</div></td>";
                            return d;
                        }).collect("join", "");
                        createHtml += "</tr><tr>";
                        //attachment
                        if (setting.createWithAttachment) {
                            createHtml += "<td></td>";
                        }
                        //filter readonly
                        createHtml += data("thArr").filter(function (d) {
                            return !d.readonly;
                        }).filter(function (d) {
                            return !d.noCreate;
                        }).map(function (d) {
                            switch (d.type) {
                                case "float":
                                case "int":
                                    var maxText = (d.numMax == undefined) ? "10^10" : d.numMax;
                                    var minText = (d.numMin == undefined) ? "" : (d.numMin + "到");
                                    d = "<td>" + minText + maxText + "</td>";
                                    break;
                                default:
                                    d = "<td>" + d.min + "到" + d.max + "个字符</td>";
                                    break;
                            }
                            return d;
                        }).collect("join", "");

                        createHtml += "</tr></thead><tbody>";
                        createHtml += "</tbody></table></div>";
                        return createHtml;
                    }
                });
                node("create-head").children(".add").delegate("", "click", function (event) {
                    var createHtml = "<tr>";
                    if (setting.createWithAttachment) {
                        var trIndex = node("create-body").children("table").children("tbody").children("tr").length;
                        createHtml += "<td><div class='addon-upload' title='upload attachment' url='../Table/" + id + "temp/AttachmentTempUpload' postData='index=" + data("AttachmentTempIndex") + "&trIndex=" + trIndex + "'></div></td>";
                    }
                    //filter readonly
                    createHtml += data("thArr").filter(function (d) {
                        return !d.readonly;
                    }).filter(function (d) {
                        return !d.noCreate;
                    }).map(function (d) {
                        d = getRequestTdHtml(d);
                        return d;
                    }).collect("join", "");
                    createHtml += "</tr>";
                    node("create-body").children("table").children("tbody").append(createHtml);
                    var newSelect = node("create-body").children("table").children("tbody").children("tr:last").children("td").children(".addon-select");
                    if (data("th-data") != undefined) {
                        newSelect.each(function () {
                            var d = data("th-data")[$(this).parent().attr("th-id")];
                            d = d.map(function (d1) {
                                d1 = {"name": d1, "checked": false};
                                return d1;
                            });
                            $(this).select({"data": d});
                        });
                    }

                    $(".addon-select").select();
                    $(".addon-datepicker").datepicker();
                    $(".addon-upload").upload();
                });
                node("create-head").children(".minus").delegate("", "click", function (event) {
                    node("create-body").children("table").children("tbody").children("tr:last").remove();
                });
                node("create-head").children(".remove").delegate("", "click", function (event) {
                    node("create-body").children("table").children("tbody").children("tr").remove();
                });
                node("create-head").children(".submit").delegate("", "click", function (event) {
                    var trs = node("create-body").children("table").children("tbody").children("tr");
                    if (trs.length == 0) {
                        alert("请至少添加一行数据");
                        return;
                    }
                    if (confirm("确定要提交这" + trs.length + "行数据吗?")) {
                        //data validate
                        var isValid = true;
                        for (var i = 0; i < trs.length; i++) {
                            data("thArr").relateCallback($(trs[i]).children("td"), function (e1, e2) {
                                var value = getRequestTdData($(e2), e1.type);
                                if (value == null) {
                                    alert("unknown column type");
                                    isValid = false;
                                    return false;
                                }
                                if (e1.type != "multi-select") {
                                    if (e1.min > value.length) {
                                        alert("第" + (i + 1) + "行的“" + e1.name + "”长度必须大于等于" + e1.min);
                                        isValid = false;
                                        return false;
                                    }
                                    if (value.length > e1.max) {
                                        alert("第" + (i + 1) + "行的“" + e1.name + "”长度必须小于等于" + e1.max);
                                        isValid = false;
                                        return false;
                                    }
                                }
                            }, function (d) {
                                return d.id;
                            }, function (d) {
                                return $(d).attr("th-id");
                            });
                        }
                        ;
                        if (!isValid) {
                            return;
                        }

                        var requestData = data("thArr").filter(function (d) {
                            return !(d.readonly || d.noCreate);
                        }).map(function (d) {
                            var requestValue = trs.toArray().map(function (d1) {
                                var tdValue = getRequestTdData(d1.children("td[th-id=" + d.id + "]"), d.type);
                                return new myString(tdValue).base64UrlEncode().value;
                            }).collect("join", ",");
                            d = d.id + "=" + requestValue;
                            return d;
                        }).collect("join", "&");
                        http.request(url + "Create", requestData).then(function (result) {
                            node("request").children(".create").children(".contain").children(".switch").click();
                            data("Read")(url);
                            node("create-body").children("table").children("tbody").children("tr").remove();
                        }, function (result) {
                            alert("create data failed：" + result);
                        });
                    }
                });

                //relate create wall
                if (setting.related != "" && $("#" + setting.related).attr("relateCreate") != undefined) {
                    $("#" + setting.related).children(".request").children(".relateCreate").wall({
                        "html": function () {
                            var createHtml = "<div class='head'>";
                            createHtml += "<button class='add btn btn-info'><i class='fa fa-plus'></i></button>";
                            createHtml += "<button class='minus btn btn-warning'><i class='fa fa-minus'></i></button>";
                            createHtml += "<button class='remove btn btn-danger'><i class='fa fa-times'></i></button>";
                            createHtml += "<button class='submit btn btn-warning'><i class='fa fa-fa-floppy-o'></i>submit</button>";
                            createHtml += "</div>";
                            createHtml += "<div class='body'>";
                            createHtml += "<table class='table table-bordered table-condensed table-hover'><thead><tr>";
                            //attachment
                            if (setting.createWithAttachment) {
                                createHtml += "<td><div>attachment</div></td>";
                            }
                            //filter readonly
                            createHtml += data("thArr").filter(function (d) {
                                return !d.readonly;
                            }).filter(function (d) {
                                return !d.noCreate;
                            }).map(function (d) {
                                d = "<td><div>" + d.name + "</div></td>";
                                return d;
                            }).collect("join", "");
                            createHtml += "</tr><tr>";
                            //attachment
                            if (setting.createWithAttachment) {
                                createHtml += "<td></td>";
                            }
                            //filter readonly
                            createHtml += data("thArr").filter(function (d) {
                                return !d.readonly;
                            }).filter(function (d) {
                                return !d.noCreate;
                            }).map(function (d) {
                                switch (d.type) {
                                    case "float":
                                    case "int":
                                        var maxText = (d.numMax == undefined) ? "10^10" : d.numMax;
                                        var minText = (d.numMin == undefined) ? "" : (d.numMin + "到");
                                        d = "<td>" + minText + maxText + "</td>";
                                        break;
                                    default:
                                        d = "<td>" + d.min + "到" + d.max + "个字符</td>";
                                        break;
                                }
                                return d;
                            }).collect("join", "");

                            createHtml += "</tr></thead><tbody>";
                            createHtml += "</tbody></table></div>";
                            return createHtml;
                        }
                    });
                    node("relate-create-head").children(".add").delegate("", "click", function (event) {
                        var createHtml = "<tr>";
                        if (setting.createWithAttachment) {
                            var trIndex = node("relate-create-body").children("table").children("tbody").children("tr").length;
                            createHtml += "<td><div class='addon-upload' title='upload attachment' url='../Table/" + id + "temp/AttachmentTempUpload' postData='index=" + data("AttachmentTempIndex") + "&trIndex=" + trIndex + "'></div></td>";
                        }
                        //filter readonly
                        createHtml += data("thArr").filter(function (d) {
                            return !d.readonly;
                        }).filter(function (d) {
                            return !d.noCreate;
                        }).map(function (d) {
                            d = getRequestTdHtml(d);
                            return d;
                        }).collect("join", "");
                        createHtml += "</tr>";
                        node("relate-create-body").children("table").children("tbody").append(createHtml);
                        var newSelect = node("relate-create-body").children("table").children("tbody").children("tr:last").children("td").children(".addon-select");
                        if (data("th-data") != undefined) {
                            newSelect.each(function () {
                                var d = data("th-data")[$(this).parent().attr("th-id")];
                                d = d.map(function (d1) {
                                    d1 = {"name": d1, "checked": false};
                                    return d1;
                                });
                                $(this).select({"data": d});
                            });
                        }

                        $(".addon-select").select();
                        $(".addon-datepicker").datepicker();
                        $(".addon-upload").upload();
                    });
                    node("relate-create-head").children(".minus").delegate("", "click", function (event) {
                        node("relate-create-body").children("table").children("tbody").children("tr:last").remove();
                    });
                    node("relate-create-head").children(".remove").delegate("", "click", function (event) {
                        node("relate-create-body").children("table").children("tbody").children("tr").remove();
                    });
                    node("relate-create-head").children(".submit").delegate("", "click", function (event) {
                        var trs = node("relate-create-body").children("table").children("tbody").children("tr");
                        if (trs.length == 0) {
                            alert("请至少添加一行数据");
                            return;
                        }
                        if (confirm("确定要提交这" + trs.length + "行数据吗?")) {
                            //data validate
                            var isValid = true;
                            for (var i = 0; i < trs.length; i++) {
                                data("thArr").relateCallback($(trs[i]).children("td"), function (e1, e2) {
                                    var value = getRequestTdData($(e2), e1.type);
                                    if (value == null) {
                                        alert("unknown column type");
                                        isValid = false;
                                        return false;
                                    }
                                    if (e1.type != "multi-select") {
                                        if (e1.min > value.length) {
                                            alert("第" + (i + 1) + "行的“" + e1.name + "”长度必须大于等于" + e1.min);
                                            isValid = false;
                                            return false;
                                        }
                                        if (value.length > e1.max) {
                                            alert("第" + (i + 1) + "行的“" + e1.name + "”长度必须小于等于" + e1.max);
                                            isValid = false;
                                            return false;
                                        }
                                    }
                                }, function (d) {
                                    return d.id;
                                }, function (d) {
                                    return $(d).attr("th-id");
                                });
                            }
                            ;
                            if (!isValid) {
                                return;
                            }

                            var requestData = data("thArr").filter(function (d) {
                                return !(d.readonly || d.noCreate);
                            }).map(function (d) {
                                var requestValue = trs.toArray().map(function (d1) {
                                    var tdValue = getRequestTdData(d1.children("td[th-id=" + d.id + "]"), d.type);
                                    return new myString(tdValue).base64UrlEncode().value;
                                }).collect("join", ",");
                                d = d.id + "=" + requestValue;
                                return d;
                            }).collect("join", "&");
                            http.request(url + "Create", requestData).then(function (result) {
                                $("#" + setting.related).children(".request").children(".create").children(".contain").children(".switch").click();
                                data("Read")(url);
                                node("relate-create-body").children("table").children("tbody").children("tr").remove();
                            }, function (result) {
                                alert("create data failed：" + result);
                            });
                        }
                    });
                }
                ;

                //update wall
                node("request").children(".update").wall({
                    "html": function () {
                        var updateHtml = "<div class='head'><button class='submit btn btn-warning'>submit</button></div><div class='body'>";
                        //content table
                        updateHtml += "<table class='content table table-bordered table-condensed table-hover'><thead><tr>";
                        updateHtml += data("thArr").map(function (d) {
                            d = "<td><div>" + d.name + "</div></td>";
                            return d;
                        }).collect("join", "");
                        updateHtml += "</tr><tr>";
                        updateHtml += data("thArr").map(function (d) {
                            switch (d.type) {
                                case "float":
                                case "int":
                                    var maxText = (d.numMax == undefined) ? "10^10" : d.numMax;
                                    var minText = (d.numMin == undefined) ? "" : (d.numMin + "到");
                                    d = "<td>" + minText + maxText + "</td>";
                                    break;
                                default:
                                    d = "<td>" + d.min + "到" + d.max + "个字符</td>";
                                    break;
                            }
                            return d;
                        }).collect("join", "");
                        updateHtml += "</tr></thead><tbody>";
                        updateHtml += "</tbody></table>";
                        //unity table
                        updateHtml += "<table class='unity table table-bordered table-condensed table-hover'><thead><tr>";
                        updateHtml += data("thArr").map(function (d) {
                            d = "<td><div>" + d.name + "</div></td>";
                            return d;
                        }).collect("join", "");
                        updateHtml += "</tr><tr class='danger'><td colspan='" + data("thArr").length + "'>you can set a column value of the table above uniformity</td></tr></thead>";
                        updateHtml += "<tbody><tr class='danger'>";
                        var unityTrHtml = data("thArr").map(function (d) {
                            var tdHtml = getRequestTdHtml(d);
                            return tdHtml;
                        }).collect("join", "");
                        updateHtml += unityTrHtml;
                        updateHtml += "</tr></tbody></table>";
                        updateHtml += "</div>";
                        return updateHtml;
                    },
                    "openCallback": function () {
                        var checkedArr = [];
                        node("tbody-checkbox").each(function () {
                            if ($(this).prop("checked")) {
                                checkedArr.push($(this));
                            }
                        });
                        if (checkedArr.length == 0) {
                            alert("请至少勾选一行需要更改的数据");
                            return false;
                        } else {
                            var trHtml = "";
                            for (var i = 0; i < checkedArr.length; i++) {
                                trHtml += "<tr>";
                                trHtml += data("thArr").map(function (d) {
                                    var tdText = checkedArr[i].parent().parent().children("td[th-id=" + d.id + "]").text();
                                    var tdHtml = getRequestTdHtml(d, tdText);
                                    return tdHtml;
                                }).collect("join", "");
                                trHtml += "</tr>";
                            }
                            node("update-body").children(".content").children("tbody").html(trHtml);
                            //set default value


                            //set unity tr html
                            var unityHtml = "<tr>" + data("thArr").map(function (d) {
                                    var tdText = checkedArr[0].parent().parent().children("td[th-id=" + d.id + "]").text();
                                    var tdHtml = getRequestTdHtml(d, tdText);
                                    return tdHtml;
                                }).collect("join", "") + "</tr>";
                            node("update-body").children(".unity").children("tbody").html(unityHtml);
                            //listen unity tr changed
                            node("update-body").children(".unity").children("tbody").children("tr").children("td").children("input,select").delegate("", "change", function () {
                                var unityChangeThId = $(this).parent().attr("th-id");
                                var unityChangeThValue = $(this).val();
                                var needChangeElement = $(this).parent().parent().parent().parent().parent().children(".content").children("tbody").children("tr").children("td[th-id=" + unityChangeThId + "]");
                                needChangeElement.children("input,select").val(unityChangeThValue);
                            });

                            $(".addon-select").select();
                            $(".addon-datepicker").datepicker();
                            return true;
                        }
                        ;

                    }
                });
                node("update-head").children(".submit").delegate("", "click", function () {
                    var trs = node("update-body").children(".content").children("tbody").children("tr");
                    if (confirm("确定要提交这" + trs.length + "行数据吗?")) {
                        var requestData = data("thArr").map(function (d) {
                            var requestValue = trs.toArray().map(function (d1) {
                                var tdValue = getRequestTdData(d1.children("td[th-id=" + d.id + "]"), d.type);
                                return new myString(tdValue).base64UrlEncode().value;
                            }).collect("join", ",");
                            d = d.id + "=" + requestValue;
                            return d;
                        }).collect("join", "&");
                        http.request(url + "Update", requestData).then(function (result) {
                            node("request").children(".update").children(".contain").children(".panel").hide();
                            data("Read")(url);
                        }, function (result) {
                            alert("update data failed：" + result);
                        });
                    }
                });

                node("request").children(".attachmentBatchDownload").delegate("", "click", function () {
                    if (confirm("你确定要下载勾选的" + n + "行数据的所有附件吗？")) {
                        var requestData = "batchkey=" + data("thArr").filter(function (d) {
                                return d.key;
                            }).map(function (d) {
                                d = selectedTr.map(function (d1) {
                                    var tdValue = getRequestTdData(d1.children("td[th-id=" + d.id + "]"), d.type);
                                    return new myString(tdValue).base64UrlEncode().value;
                                }).collect("join", ",");
                                return d;
                            }).collect("join", "");

                        http.request(url + "AttachmentBatchDownload", requestData).then(function (result) {

                        }, function (result) {
                            alert("download data failed：" + result);
                        });
                    }

                });

                //pagination rows per page select change event
                data("rowsPerPage", 10);
                node("pagination").children("select").delegate("", "change", function (event) {
                    var rowsPerPage = $(this).find("option:selected").text();
                    data("rowsPerPage", rowsPerPage);
                    data("pageIndex", 0);
                    data("refreshDisplay")();
                });

                //pagination button click event
                node("pagination").children("button").delegate("", "click", function (event) {
                    if (data("filterColumnData") == undefined) {
                        return;
                    }
                    node("thead-checkbox").prop("checked", false);
                    var pageLength = parseInt((data("filterColumnData").length - 1) / data("rowsPerPage"));
                    if ($(this).hasClass("double-left")) {
                        data("pageIndex", 0);
                    }
                    if ($(this).hasClass("left")) {
                        var newPageIndex = (data("pageIndex") == 0) ? 0 : (data("pageIndex") - 1);
                        data("pageIndex", newPageIndex);
                    }
                    if ($(this).hasClass("right")) {
                        var newPageIndex = (data("pageIndex") == pageLength) ? data("pageIndex") : (data("pageIndex") + 1);
                        data("pageIndex", newPageIndex);
                    }
                    if ($(this).hasClass("double-right")) {
                        data("pageIndex", pageLength);
                    }
                    data("refreshDisplay")();
                });

                //thead checkbox click event
                node("thead-checkbox").delegate("", "click", function () {
                    if ($(this).prop("checked")) {
                        node("tbody-checkbox").prop({"checked": true});
                        node("tbody-row").addClass("info");
                    } else {
                        node("tbody-checkbox").prop({"checked": false});
                        node("tbody-row").removeClass("info");
                    }
                });

                //thead sort
                node("thead").children("tr").children(".content").delegate("", "click", function () {
                    data("sort")($(this));
                });

                //column filter
                node("column-filter").select({
                    "data": data("thArr"), "selectCallback": function () {
                        //hide unchecked columns
                        var currentData = node("column-filter").data("data");
                        currentData.relateCallback(node("thead-content"), function (e1, e2) {
                            e1["id"] = $(e2).attr("th-id");
                        }, function (d) {
                            return d.name;
                        }, function (d) {
                            return $(d).text();
                        });
                        currentData.relateCallback(node("content"), function (e1, e2) {
                            if (e1.checked) {
                                $(e2).removeClass("hide");
                            } else {
                                $(e2).addClass("hide");
                            }
                        }, function (d) {
                            return d.id;
                        }, function (d) {
                            return $(d).attr("th-id");
                        });
                        //update data('thArr')
                        data("thArr").relateCallback(currentData, function (e1, e2) {
                            e1.checked = e2.checked;
                        }, function (d) {
                            return d.id;
                        }, function (d) {
                            return d.id;
                        });
                    }
                });

                //row filter
                var dateFilterHtml = "";
                if (columnDateKey != undefined) {
                    dateFilterHtml += "<label>From</label><div id='" + id + "Start' class='addon-datepicker' type='" + dateFilterType + "' add-num='" + dateStartAddNum + "'></div>";
                    dateFilterHtml += "<label>To</label><div id='" + id + "End' class='addon-datepicker' type='" + dateFilterType + "' add-num='" + dateEndAddNum + "'></div>";
                }
                node("row-filter").wall({
                    "html": function () {
                        var d = "<div class='dateFilter'>" + dateFilterHtml + "</div>";
                        d += "<div class='head'><button class='btn btn-success'><i class='fa fa-plus'></i>add new filter</button></div>";
                        d += "<div class='body'></div>";
                        return d;
                    }
                });
                $(".addon-datepicker").datepicker();
                data("row-length", 0);

                //delegate request buttons
                node("request").delegate(".refresh", "click", function (event) {
                    data("Read")(url);
                });
                node("request").delegate(".download", "click", function (event) {
                    //thead data
                    var checkedArr = data("thArr").filter(function (d) {
                        return d.checked;
                    });
                    var requestData = checkedArr.map(function (d) {
                        return d.name;
                    }).collect("join", "\t");
                    requestData += "\n";
                    if (data("filterColumnData") != undefined) {
                        //tbody data
                        requestData += data("filterColumnData").map(function (d) {
                            var excelRow = "";
                            for (var i = 0; i < checkedArr.length; i++) {
                                var columnId = checkedArr[i].id;
                                excelRow += d[columnId];
                                if (i != checkedArr.length - 1) {
                                    excelRow += "\t";
                                }
                            }
                            return excelRow;
                        }).collect("join", "\n");
                    }

                    var titleSource = title;
                    var requestDataSource = requestData;
                    title = new myString(title).base64UrlEncode().value;
                    requestData = new myString(requestData).base64UrlEncode().value;
                    var requestData = "title=" + title + "&data=" + requestData;
                    http.request(url + "Download", requestData).then(function (result) {
                        window.location.href = "../ApplicationData/excel/" + result + "/" + titleSource + ".xlsx";
                    }, function (result) {
                        alert("download data failed");
                    });
                });
                node("request").children(".delete").delegate("", "click", function (event) {
                    var selectedArr = [];
                    node("tbody-checkbox").each(function () {
                        if ($(this).prop("checked")) {
                            selectedArr.push($(this).parent().parent().attr("row-index"));
                        }
                    });
                    if (selectedArr.length == 0) {
                        alert("请至少勾选一行数据");
                        return;
                    }
                    if (confirm("确定要删除所勾选的" + selectedArr.length + "行数据吗？")) {
                        var requestData = data("thArr").map(function (d) {
                            var requestName = d.id;
                            var requestValue = selectedArr.map(function (d1) {
                                d1 = data("displayData")[d1 % data("rowsPerPage")][requestName];
                                d1 = new myString(d1).base64UrlEncode().value;
                                return d1;
                            }).collect("join", ",");
                            var requestStr = requestName + "=" + requestValue;
                            return requestStr;
                        }).collect("join", "&");
                        data("loading")();
                        http.request(url + "Delete", requestData).then(function (result) {
                            data("Read")(url);
                        }, function (result) {
                            alert("delete data failed");
                        });
                    } else {
                        return;
                    }
                });


                //filter button click event
                element.children(".filter").delegate(".filter", "click", function (event) {
                    if (data("data") == undefined) {
                        return;
                    }
                    var filterColumnData = data("data").filter(function (d) {
                        if (columnDateKey != undefined) {
                            var startTime = $("#" + id + "Start").data("data");
                            var endTime = $("#" + id + "End").data("data");
                            if (startTime.split("-").length == 2) {
                                startTime = startTime + "-01";
                            }
                            if (endTime.split("-").length == 2) {
                                endTime = endTime + "-01";
                            }
                            if (!(d[columnDateKey] == later(startTime, d[columnDateKey]) && endTime == later(endTime, d[columnDateKey]))) {
                                return false;
                            }
                        }

                        var isValid = true;
                        node("row-filter-body-div").each(function () {
                            var values = $(this).children(".addon-select").data("data");
                            //find id by name
                            var name = $(this).children("select").find("option:selected").text();
                            var colunmId = data("thArr").filter(function (d1) {
                                if (d1.name == name) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }).map(function (d1) {
                                return d1.id;
                            }).collect("join", "");
                            values = values.filter(function (d1) {
                                if (d1.checked) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }).map(function (d1) {
                                return d1.name;
                            });
                            if (values.indexOf(d[colunmId]) == -1) {
                                isValid = false;
                                return false;
                            }
                        });
                        return isValid;
                    }).filter(function (d) {
                        if (d == undefined) {
                            return false;
                        } else {
                            return true;
                        }
                    });

                    //refresh html
                    data("pageIndex", 0);
                    data("filterColumnData", filterColumnData);
                    data("setCurrentPageHtml")();


                    //tbody checkbox click event
                    node("tbody").children("tr").children(".pre").delegate("input", "click", function () {
                        if ($(this).prop("checked")) {
                            $(this).parent(".pre").parent("tr").addClass("info");
                        } else {
                            $(this).parent(".pre").parent("tr").removeClass("info");
                        }
                    });
                });

                //row filter add button click event
                node("row-filter-head").delegate("button", "click", function () {
                    //element select
                    var row = "<select>";
                    row += data("thArr").map(function (d) {
                        var d1 = "<option>" + d.name + "</option>";
                        return d1;
                    }).collect("join", "");
                    row += "</select>";
                    //element addon-select
                    row += "<div class='addon-select' title='value filter'></div>";
                    //element remove button
                    row += "<button class='btn btn-danger'><i class='fa fa-times'></i></button>";
                    //build row html
                    var rowId = data("row-length");
                    node("row-filter-body").append("<div row-id='" + rowId + "'>" + row + "</div>");
                    data("row-length", rowId + 1);
                    //init value filter select
                    var rowValueSelect = node("row-filter-body").children("div[row-id=" + rowId + "]").children(".addon-select");
                    rowValueSelect.select();
                    //when open a filter select,close other filter select
                    rowValueSelect.children(".contain").children(".switch").delegate("", "click", function () {
                        var otherRowDiv = $(this).parent().parent().parent().siblings("div");
                        if (otherRowDiv.attr("row-id") != rowId) {
                            otherRowDiv.children(".addon-select").children(".contain").children(".panel").hide();
                        }
                    });
                    //delegate button select values
                    var setSelectValues = function (rowSelect) {
                        var selectedText = rowSelect.find("option:selected").text();
                        //find selected th-id by th-name
                        var selected = data("thArr").filter(function (d) {
                            return (d.name == selectedText);
                        });
                        var selectedId = selected[0].id;
                        if (data("data") == undefined) {
                            return;
                        }
                        var d = data("data").map(function (d) {
                            var v = d[selectedId];
                            return {"name": v, "checked": true};
                        });
                        rowSelect.parent().children("div").select();
                        d = d.filter(function (d1) {
                            if (d1.name == "" || d1.name == undefined) {
                                return false;
                            } else {
                                return true;
                            }
                        });
                        d = d.distinct(function (d) {
                            return d.name;
                        });
                        rowSelect.parent().children("div").select({"data": d});
                    }
                    //set values when select init or change
                    setSelectValues(node("row-filter-body").children("div[row-id=" + rowId + "]").children("select"));
                    $(this).parent().parent().children(".body").children("div").delegate("select", "change", function () {
                        setSelectValues($(this));
                    });

                    //button remove click event
                    node("row-filter-body-div").delegate(".btn-danger", "click", function (event) {
                        $(this).parent().remove();
                        event.stopPropagation();
                    });

                });

            })();

            //add to element data
            data("init", true);
            data("pageIndex", 0);

        }
        ;

        if (options == undefined) {
            return;
        }

        //set data
        if (options.data != undefined) {
            data("setData")(options.data);
            data("refreshDisplay")();
        }

        //request read
        if (options.read != undefined) {
            data("relatedData", (options.relatedData == undefined) ? "" : options.relatedData);

            data("Read")(options.read);

        }

        //request filter select data
        if (options.requestFilterData != undefined) {
            node("request").children(".request-filter").each(function () {
                var thisSelect = $(this);
                var selectId = requestFilter.filter(function (d) {
                    return (d[1] == thisSelect.attr("title"));
                }).map(function (d) {
                    return d[0];
                }).collect("join", "");
                $(this).select({"data": options.requestFilterData[selectId]});
            });
            //add to related element data
            if (relate != "") {
                var parentRelatedData = options.requestFilterData;
                var oldData = $("#" + relate).data("parentRelatedData");
                $.extend(parentRelatedData, oldData);
                $("#" + relate).data("parentRelatedData", parentRelatedData);
            }
        }

        if (options.beforeCreateOpenCallback != undefined) {
            node("request").children(".create").wall({"beforeOpenCallback": options.beforeCreateOpenCallback});
            if (setting.related != "" && $("#" + setting.related).attr("relateCreate") != undefined) {
                $("#" + setting.related).children(".request").children(".relateCreate").wall({"beforeOpenCallback": options.beforeCreateOpenCallback});
            }
        }
        if (options.beforeUpdateOpenCallback != undefined) {
            node("request").children(".update").wall({"beforeOpenCallback": options.beforeUpdateOpenCallback});
        }

        return element;
    }

}));

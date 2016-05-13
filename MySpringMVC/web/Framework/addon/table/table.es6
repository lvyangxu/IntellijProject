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
        for (let i = 0; i < requestFilterKeyArr.length; i++) {
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
        colspanAddNum = settings.relate ? (colspanAddNum + 1) : colspanAddNum;
        colspanAddNum = settings.attachment ? (colspanAddNum + 1) : colspanAddNum;

        let node = {
            table(){
                return element.children("table");
            },
            content(){
                return element.xPath("table>thead,tbody>tr>.content");
            },
            thead(){
                return element.xPath("table>thead");
            },
            theadContent(){
                return element.xPath("table>thead>tr>.content");
            },
            tbody(){
                return element.xPath("table>tbody");
            },
            tbodyRow(){
                return element.xPath("table>tbody>tr");
            },
            theadCheckbox(){
                return element.xPath("table>thead>tr>.pre>input[type=checkbox]");
            },
            tbodyCheckbox(){
                return element.xPath("table>tbody>tr>.pre>input[type=checkbox]");
            },
            initSpan(){
                return element.children("span");
            },
            columnFilter(){
                return element.xPath(".filter>.column-filter");
            },
            rowFilter(){
                return element.xPath(".filter>.row-filter");
            },
            rowFilterBodyDiv(){
                return element.xPath(".filter>.row-filter>.contain>.panel>.body>div");
            },
            rowFilterHead(){
                return element.xPath(".filter>.row-filter>.contain>.panel>.head");
            },
            rowFilterBody(){
                return element.xPath(".filter>.row-filter>.contain>.panel>.body");
            },
            createHead(){
                return element.xPath(".request>.create>.contain>.panel>.head");
            },
            createBody(){
                return element.xPath(".request>.create>.contain>.panel>.body");
            },
            updateHead(){
                return element.xPath(".request>.update>.contain>.panel>.head");
            },
            updateBody(){
                return element.xPath(".request>.update>.contain>.panel>.body");
            },
            relateCreateHead(){
                return $("#" + settings.related).xPath(".request>.relateCreate>.contain>.panel>.head");
            },
            relateCreateBody(){
                return $("#" + settings.related).xPath(".request>.relateCreate>.contain>.panel>.body");
            },
            filter(){
                return element.children(".filter");
            },
            request(){
                return element.children(".request");
            },
            pagination(){
                return element.children(".pagination")
            }
        };

        let func = {
            loading(){
                let columnFilterData = node.columnFilter().data("data");
                if (columnFilterData != undefined) {
                    let l = columnFilterData.filter((d)=> {
                        return d.checked;
                    }).length;
                    let currentColumnLength = l + colspanAddNum;
                    node.tbody().html("<tr><td colspan='" + currentColumnLength + "'><i class='animation fa fa-refresh'></i></td></tr>");
                }
            },
            noData(){
                let columnFilterData = node.columnFilter().data("data");
                if (columnFilterData != undefined) {
                    let l = columnFilterData.filter((d)=> {
                        return d.checked;
                    }).length;
                    let currentColumnLength = l + colspanAddNum;
                    node.tbody().html("<tr><td colspan='" + currentColumnLength + "'>There is not any matched data for last request</i></td></tr>");
                }
            },
            fail(message){
                let columnFilterData = node.columnFilter().data("data");
                if (columnFilterData != undefined) {
                    let l = columnFilterData.filter((d)=> {
                        return d.checked;
                    }).length;
                    let currentColumnLength = l + colspanAddNum;
                    node.tbody().html("<tr><td colspan='" + currentColumnLength + "'>Request Failed: " + message + "</td></tr>");
                }
            },
            read(requestUrl, requestData){
                func.loading();
                //refresh parent related data
                if (settings.relate != "") {
                    node.request().children(".request-filter").each(function () {
                        let thisSelect = $(this);
                        let selectId = requestFilter.filter((d)=> {
                            d = (d[1] == thisSelect.attr("title"));
                            return d;
                        }).map(function (d) {
                            return d[0];
                        }).collect("join", "");
                        let oldData = $("#" + relate).data("parentRelatedData");
                        let newData = {
                            selectId: thisSelect.data("data")
                        };
                        $.extend(oldData, newData);
                        $("#" + relate).data("parentRelatedData", oldData);
                    });
                }
                //add relatedData to requestParam
                let relatedRequestData = (settings.related != "") ? data("relatedData") : "";
                requestData = (requestData == undefined) ? relatedRequestData : (requestData + "&" + relatedRequestData);
                if (requestFilter.length > 0) {
                    requestData += (requestData == "") ? "" : "&";
                    requestData += Array.from(node.request().children(".request-filter")).map((d)=> {
                        if ($(d).data("data") == undefined) {
                            return "";
                        }
                        let selectId = requestFilter.filter((d1)=> {
                            return (d1[1] == $(d).attr("title"));
                        }).map((d1)=> {
                            return d1[0];
                        }).collect("join", "");

                        d = selectId + "=" + $(d).data("data").filter((d1)=> {
                                return d1.checked;
                            }).map((d1)=> {
                                return new myString(d1.name).base64UrlEncode().value;
                            }).collect("join", ",");
                        return d;
                    }).collect("join", "&");
                }
                //add parentRelatedData to requestParam
                if (element.data("parentRelatedData") != undefined) {
                    requestData += "&";
                    let parentRelatedData = element.data("parentRelatedData");
                    for (let key in parentRelatedData) {
                        let v = parentRelatedData[key].filter((d)=> {
                            return d.checked;
                        }).map((d)=> {
                            return new myString(d1.name).base64UrlEncode().value;
                        }).collect("join", ",");
                        requestData += key + "=" + v + "&";
                    }
                    requestData = requestData.substr(0, requestData.length - 1);
                }

                requestUrl = (requestUrl == undefined || requestUrl == "") ? url : requestUrl;
                http.request(requestUrl + "Read", requestData).then((result)=> {
                    this.setData(result);
                    element.data("pageIndex", 0);
                    this.refreshDisplay();
                }, (result)=> {
                    if (result.startsWith("relogin:")) {
                        window.location.href = "../login/";
                    } else {
                        func.fail();
                    }
                });
            },
            refreshAttachment(attachmentTbody, columnKeyValueArr){
                let requestData = element.data("thArr").filter((d)=> {
                    return d.key;
                }).map((d)=> {
                    d = d.id + "=" + columnKeyValueArr.filter((d1)=> {
                            return (d1.split("=")[0] == d.id);
                        }).map((d1)=> {
                            return d1.split("=")[1];
                        }).collect("join", "");
                    return d;
                }).collect("join", "&");
                let currentKey = columnKeyValueArr.map((d)=> {
                    return d.split("=")[1];
                }).collect("join", "_");
                http.request(settings.url + "AttachmentList", "key=" + currentKey).then((result)=> {
                    let attachmentReadBodyHtml = (result.length == 0) ? "<tr><td colspan='5'>no attachment</td></tr>" : (result.map((d)=> {
                        let size = (d.size > 1024 * 1024) ? ((d.size / 1024 / 1024).toFixed(2) + "M") : ((d.size / 1024).toFixed(2) + "KB");
                        d = "<tr><td><input type='checkbox'></td><td class='name'>" + d.name + "</td><td>" + size + "</td><td><i class='fa fa-download'></i></td><td><i class='fa fa-eye'></i></td></tr>";
                        return d;
                    }).collect("join", ""));
                    attachmentTbody.html(attachmentReadBodyHtml);
                    //download attachement
                    attachmentTbody.children("tr").children("td").children(".fa-download").delegate("", "click", ()=> {
                        let attachmentName = $(this).parent().parent().children(".name").text();
                        window.location.href = url + "AttachmentDownload/" + currentKey + "?fileName=" + attachmentName;
                    });
                    //preview
                    attachmentTbody.children("tr").children("td").children(".fa-eye").delegate("", "click", function () {
                        let attachmentName = $(this).parent().parent().children(".name").text();
                        let keyTemp = currentKey;
                        window.open("../Upload/" + id + "/" + keyTemp.decode("url").decode("base64") + "/" + attachmentName);
                    });
                }, (result)=> {
                    alert("get AttachmentList failed：" + result);
                });
            },
            setData(d){
                element.data("data", d);
                let sourceData = [];
                for (let i = 0; i < d.length; i++) {
                    sourceData.push(d[i]);
                }
                element.data("sourceData", sourceData);
                element.data("filterColumnData", d);
            },
            setCurrentPageHtml(){
                if (element.data("filterColumnData") == undefined) {
                    return;
                }
                let startPageIndex = element.data("pageIndex") * element.data("rowsPerPage");
                let endPageIndex = (element.data("pageIndex") + 1) * element.data("rowsPerPage");
                let rowIndex = 0;
                let displayHtmlArr = element.data("filterColumnData").map((d)=> {
                    let result = "<tr row-index='" + rowIndex + "'>";
                    result += "<td class='pre'><input type='checkbox'></td>";
                    let attachmentHtml = (settings.attachment != "") ? "<td class='pre'><div class='attachment addon-wall' icon='paperclip' iconOnly></td>" : "";
                    result += attachmentHtml;
                    let relateHtml = (settings.relate != "") ? "<td class='pre'><i class='relate fa fa-plus'></i></td>" : "";
                    result += relateHtml;
                    result += element.data("thArr").map((d1)=> {
                        let value = "";
                        if (d[d1.id] != undefined) {
                            value = d[d1.id];
                        }
                        let hideHtml = d1.checked ? "" : " hide";
                        let result1 = "<td th-id='" + d1.id + "' class='content" + hideHtml + "'>" + value + "</td>";
                        return result1;
                    }).collect("join", "");
                    result += "</tr>";
                    rowIndex++;
                    return result;
                }).slice(startPageIndex, endPageIndex);
                let displayData = element.data("filterColumnData").slice(startPageIndex, endPageIndex);
                element.data("displayData", displayData);
                let tbodyHtml = displayHtmlArr.collect("join", "");
                element.data("displayHtmlArr", displayHtmlArr);
                node.tbody().html(tbodyHtml);
                $(".addon-wall").wall();
                //attachment click callback
                node.tbody().children("tr").children(".pre").children(".attachment").children(".contain").children(".switch").delegate("", "click", function () {
                    let thisAttachmentIcon = $(this).parent().parent();
                    let columnKeyValueArr = element.data("thArr").filter(function (d) {
                        return d.key;
                    }).map((d)=> {
                        d = d.id + "=" + new myString(thisAttachmentIcon.parent().parent().children("td[th-id=" + d.id + "]").text()).base64UrlEncode().value;
                        return d;
                    });

                    let attachmentWallHtml = "<div class='head'>";
                    attachmentWallHtml += "<button class='refresh btn btn-warning'><i class='fa fa-refresh'></i></button>";
                    attachmentWallHtml += "<div class='addon-upload' title='upload attachment' url='../Table/" + settings.id + "/AttachmentUpload' postData='key=" + columnKeyValueArr.map((d)=> {
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
                    let attachmentTbody = thisAttachmentIcon.children(".contain").children(".panel").children(".body").children("table").children("tbody");
                    func.refreshAttachment(attachmentTbody, columnKeyValueArr);

                    thisAttachmentIcon.children(".contain").children(".panel").children(".head").children(".addon-upload").upload({
                        "hideCallback": function () {
                            data("refreshAttachment")(attachmentTbody, columnKeyValueArr);
                        }
                    });

                    //attachment list refresh
                    thisAttachmentIcon.children(".contain").children(".panel").children(".head").children(".refresh").delegate("", "click", ()=> {
                        func.refreshAttachment(attachmentTbody, columnKeyValueArr);
                    });
                    //attachment delete
                    thisAttachmentIcon.children(".contain").children(".panel").children(".head").children(".delete").delegate("", "click", function () {
                        let thisTrs = $(this).parent().parent().children(".body").children("table").children("tbody").children("tr");
                        let deleteNameArr = [];
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
                            http.request(settings.url + "AttachmentDelete", "key=" + columnKeyValueArr.map((d)=> {
                                    return d.split("=")[1];
                                }).collect("join", "_") + "&name=" + deleteNameArr.map((d)=> {
                                    return new myString(d).base64UrlEncode().value;
                                }).collect("join", ",")).then(function (result) {
                                func.refreshAttachment(attachmentTbody, columnKeyValueArr);
                            }, (result)=> {
                                alert("get AttachmentList failed：" + result);
                            });
                        }
                    });


                });

                //relate click callback
                node.tbody().children("tr").children(".pre").children(".relate").delegate("", "click", function () {
                    $(this).parent().parent().siblings().fadeToggle("slow");
                    let relateIcon = $(this);
                    node.pagination().fadeToggle("fast", ()=> {
                        node.filter().fadeToggle("fast", ()=> {
                            node.request().fadeToggle("fast", ()=> {
                                if (relateIcon.hasClass("fa-plus")) {
                                    relateIcon.addClass("fa-minus");
                                    relateIcon.removeClass("fa-plus");
                                    $("#" + relate).toggle("fast", ()=> {
                                        let relatedData = element.data("thArr").filter((d)=> {
                                            return d.key;
                                        }).map((d)=> {
                                            d = d.id + "=" + new myString(relateIcon.parent().parent().children(".content[th-id=" + d.id + "]").text()).base64UrlEncode().value;
                                            return d;
                                        }).collect("join", "&");
                                        $("#" + relate).table({
                                            "read": "../Table/" + relate + "/",
                                            "relatedData": relatedData
                                        })
                                    });
                                } else {
                                    relateIcon.addClass("fa-plus");
                                    relateIcon.removeClass("fa-minus");
                                    //refresh data
                                    func.read();
                                    $("#" + relate).toggle("fast");
                                }
                            });
                        });
                    });
                });
            },
            refreshDisplay(){
                this.setCurrentPageHtml();
                if (element.data("filterColumnData") == undefined) {
                    this.noData();
                    return;
                }
                let pageLength = parseInt((element.data("filterColumnData").length - 1) / element.data("rowsPerPage"));
                let start;
                if (element.data("pageIndex") <= 2) {
                    start = 0;
                } else if (element.data("pageIndex") >= pageLength - 2) {
                    start = pageLength - 4;
                } else {
                    start = element.data("pageIndex") - 2;
                }
                let arr = [];
                for (let i = start; i <= start + 4; i++) {
                    if (i < 0) {
                        continue;
                    }
                    if (i > pageLength) {
                        break;
                    }
                    arr.push(i);
                }
                let paginationButtonHtml = arr.map((d)=> {
                    let btnClass = (d == element.data("pageIndex")) ? "btn-success" : "btn-info";
                    d = "<button class='btn " + btnClass + "'>" + (d + 1) + "</button>";
                    return d;
                }).collect("join", "");
                node.pagination().children("span").html(paginationButtonHtml);

                //pagination button click event
                node.pagination().children("span").children("button").delegate("", "click", function() {
                    node.theadCheckbox().prop("checked", false);
                    element.data("pageIndex", parseInt($(this).text()) - 1);
                    func.refreshDisplay();
                });

                //listen tbody checkbox
                node.tbodyCheckbox().delegate("", "click", function () {
                    if ($(this).prop("checked")) {
                        $(this).parent(".pre").parent("tr").addClass("info");
                    } else {
                        $(this).parent(".pre").parent("tr").removeClass("info");
                    }
                });
                node.rowFilterBody().html("");
            },
            sort(thisElement){
                let sortId = thisElement.attr("th-id");
                if (thisElement.children("i").hasClass("fa-sort-asc")) {
                    //sort asc to no sort
                    this.setData(element.data("sourceData"));
                    thisElement.children("i").removeClass("fa fa-sort-asc");
                    thisElement.children("i").addClass("fa fa-sort");
                } else if (thisElement.children("i").hasClass("fa-sort-desc")) {
                    //sort desc to asc
                    element.data("data").sort(function (a, b) {
                        let va = isNaN(parseFloat(a[sortId])) ? a[sortId] : parseFloat(a[sortId]);
                        let vb = isNaN(parseFloat(b[sortId])) ? b[sortId] : parseFloat(b[sortId]);
                        return va < vb ? 1 : -1;
                    });
                    thisElement.children("i").removeClass("fa fa-sort-desc");
                    thisElement.children("i").addClass("fa fa-sort-asc");
                } else {
                    //set other th no sort
                    thisElement.parent().children(".content").children("i").attr("class", "fa fa-sort");

                    //no sort to desc
                    element.data("data").sort(function (a, b) {
                        let va = isNaN(parseFloat(a[sortId])) ? a[sortId] : parseFloat(a[sortId]);
                        let vb = isNaN(parseFloat(b[sortId])) ? b[sortId] : parseFloat(b[sortId]);
                        return va > vb ? 1 : -1;
                    });
                    thisElement.children("i").removeClass("fa fa-sort");
                    thisElement.children("i").addClass("fa fa-sort-desc");
                }

                this.refreshDisplay();
            },
            getRequestTdData(td, type){
                let result = "";
                switch (type) {
                    case "multi-select":
                        result = td.children(".addon-select").data("data").filter((d)=> {
                            return d.checked;
                        }).map((d)=> {
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
            },
            getRequestTdHtml(d, v){
                let result = "";
                let defaultValue = "";
                let readonlyHtml = ((d.readonly || d.updateReadonly) && v != undefined) ? " readonly" : "";
                let keyHtml = (d.key && v != undefined) ? " readonly" : "";
                switch (d.type) {
                    case "single-select":
                        if (element.data("th-data") != undefined) {
                            result = element.data("th-data")[d.id];
                            if (result != undefined) {
                                result = result.map((d1)=> {
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
                        if (element.data("th-data") != undefined) {
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
                        let minHtml = (d.numMin == undefined) ? "" : " min='" + d.numMin + "'";
                        let maxHtml = (d.numMax == undefined) ? "" : " max='" + d.numMax + "'";
                        let step = (d.type == "int") ? "1" : "0.01";
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
            },
        }

        element.addonInit("table", ()=> {
            //get init data
            let thArr = [];
            node.initSpan().each(function () {
                let thId = $(this).attr("th-id");
                let thName = $(this).text();
                let checked = ($(this).attr("hide") != "");
                let key = ($(this).attr("key") == "");
                let type = $(this).attr("type");
                //default set min length 1
                let min = ($(this).attr("min") == undefined) ? 1 : $(this).attr("min");
                //default set max length 50
                let max = ($(this).attr("max") == undefined) ? 50 : $(this).attr("max");
                let unsigned = ($(this).attr("unsigned") == "");
                //default set min num 0 if not unsigned
                let numMin = (!unsigned) ? 0 : undefined;
                numMin = ($(this).attr("num-min") == undefined) ? numMin : $(this).attr("num-min");
                let numMax = $(this).attr("num-max");
                let readonly = ($(this).attr("readonly") == "readonly");
                let noCreate = ($(this).attr("noCreate") == "");
                let updateReadonly = ($(this).attr("updateReadonly") == "");

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
            element.data("thArr", thArr);

            // build thead
            element.append(()=> {
                let headHtml = "<div><header>" + settings.title + "</header></div>";
                let requestHtml = "<div class='request'><label>Request</label>";
                if (requestFilter.length > 0) {
                    requestHtml += requestFilter.map((d)=> {
                        d = "<div class='request-filter addon-select' title='" + d[1] + "'></div>";
                        return d;
                    }).collect("join", "");
                }
                requestHtml += "<button class='refresh btn btn-warning'><i class='fa fa-refresh'></i></button>";
                requestHtml += "<button class='download btn btn-warning'><i class='fa fa-download'></i></button>";
                requestHtml += (settings.curd.indexOf("c") == -1) ? "" : "<div class='create addon-wall' button-class='warning' icon='plus'></div>";
                requestHtml += (settings.curd.indexOf("u") == -1) ? "" : "<div class='update addon-wall' button-class='warning' icon='pencil-square-o'></div>";
                requestHtml += (settings.curd.indexOf("d") == -1) ? "" : "<button class='delete btn btn-danger'><i class='delete fa fa-times'></i></button>";
                if (settings.relateCreate) {
                    requestHtml += "<div class='relateCreate addon-wall' button-class='warning' icon='plus'></div>";
                }
                if (settings.attachmentBatchDownload) {
                    requestHtml += "<button class='attachmentBatchDownload btn btn-warning'><i class='fa fa-paperclip'></i></button>";
                }

                requestHtml += "</div>";
                let filters = "<div class='column-filter addon-select' title='列'></div>";
                filters += "<div class='row-filter addon-wall' title='行'></div>";
                let filterHtml = "<div class='filter'><label>Filter</label>" + filters + "<button class='filter btn btn-info'><i class='fa fa-filter'></i>filter</button></div>";
                let paginationHtml = "<div class='pagination'><label>Pagination</label>";
                paginationHtml += "<select>";
                for (let i = 5; i <= 25; i = i + 5) {
                    let selectedHtml = (i == 10) ? " selected='selected'" : "";
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
                let relateHtml = (settings.relate != "") ? "<th class='pre'>relate</th>" : "";
                let attachmentHtml = (settings.attachment != "") ? "<th class='pre'>attachment</th>" : "";
                let theadHtml = "<thead><tr><th class='pre'><input type='checkbox'></th>" + attachmentHtml + relateHtml;
                theadHtml += element.data("thArr").map((d)=> {
                    let hideHtml = d.checked ? "" : " hide";
                    d = "<th class='content" + hideHtml + "' th-id='" + d.id + "'><i class='fa fa-sort'></i>" + d.name + "</th>";
                    return d;
                }).collect("join", "");
                theadHtml += "</tr></thead>";
                let innerHtml = headHtml + "<table class='table table-bordered table-condensed table-hover'>" + theadHtml + "<tbody></tbody></table>";
                return innerHtml;
            });

            //if related,hide first
            if (settings.related != "") {
                element.hide();
            } else {
                //read data first
                func.read(settings.url);
            }

            //request filter select init
            node.request().children(".request-filter").select();

            //create wall
            node.request().children(".create").wall({
                "html": ()=> {
                    let createHtml = "<div class='head'>";
                    createHtml += "<button class='add btn btn-info'><i class='fa fa-plus'></i></button>";
                    createHtml += "<button class='minus btn btn-warning'><i class='fa fa-minus'></i></button>";
                    createHtml += "<button class='remove btn btn-danger'><i class='fa fa-times'></i></button>";
                    createHtml += "<button class='submit btn btn-warning'><i class='fa fa-fa-floppy-o'></i>submit</button>";
                    createHtml += "</div>";
                    createHtml += "<div class='body'>";
                    createHtml += "<table class='table table-bordered table-condensed table-hover'><thead><tr>";
                    //attachment
                    if (settings.createWithAttachment) {
                        createHtml += "<td><div>attachment</div></td>";
                    }
                    //filter readonly
                    createHtml += element.data("thArr").filter((d)=> {
                        return !d.readonly;
                    }).filter((d)=> {
                        return !d.noCreate;
                    }).map((d)=> {
                        d = "<td><div>" + d.name + "</div></td>";
                        return d;
                    }).collect("join", "");
                    createHtml += "</tr><tr>";
                    //attachment
                    if (settings.createWithAttachment) {
                        createHtml += "<td></td>";
                    }
                    //filter readonly
                    createHtml += element.data("thArr").filter((d)=> {
                        return !d.readonly;
                    }).filter((d)=> {
                        return !d.noCreate;
                    }).map((d)=> {
                        switch (d.type) {
                            case "float":
                            case "int":
                                let maxText = (d.numMax == undefined) ? "10^10" : d.numMax;
                                let minText = (d.numMin == undefined) ? "" : (d.numMin + "到");
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

            //create wall head
            node.createHead().children(".add").delegate("", "click", ()=> {
                let createHtml = "<tr>";
                if (settings.createWithAttachment) {
                    let trIndex = node.createBody().children("table").children("tbody").children("tr").length;
                    createHtml += "<td><div class='addon-upload' title='upload attachment' url='../Table/" + id + "temp/AttachmentTempUpload' postData='index=" + element.data("AttachmentTempIndex") + "&trIndex=" + trIndex + "'></div></td>";
                }
                //filter readonly
                createHtml += element.data("thArr").filter((d)=> {
                    return !d.readonly;
                }).filter((d)=> {
                    return !d.noCreate;
                }).map((d)=> {
                    d = func.getRequestTdHtml(d);
                    return d;
                }).collect("join", "");
                createHtml += "</tr>";
                node.createBody().children("table").children("tbody").append(createHtml);
                let newSelect = node.createBody().children("table").children("tbody").children("tr:last").children("td").children(".addon-select");
                if (element.data("th-data") != undefined) {
                    newSelect.each(function () {
                        let d = element.data("th-data")[$(this).parent().attr("th-id")];
                        d = d.map((d1)=> {
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
            node.createHead().children(".minus").delegate("", "click", ()=> {
                node.createBody().children("table").children("tbody").children("tr:last").remove();
            });
            node.createHead().children(".remove").delegate("", "click", ()=> {
                node.createBody().children("table").children("tbody").children("tr").remove();
            });
            node.createHead().children(".submit").delegate("", "click", ()=> {
                let trs = node.createBody().children("table").children("tbody").children("tr");
                if (trs.length == 0) {
                    alert("请至少添加一行数据");
                    return;
                }
                if (confirm("确定要提交这" + trs.length + "行数据吗?")) {
                    //data validate
                    let isValid = true;
                    for (let i = 0; i < trs.length; i++) {
                        element.data("thArr").relateCallback($(trs[i]).children("td"), function (e1, e2) {
                            let value = func.getRequestTdData($(e2), e1.type);
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
                    if (!isValid) {
                        return;
                    }

                    let requestData = element.data("thArr").filter((d)=> {
                        return !(d.readonly || d.noCreate);
                    }).map((d)=> {
                        let requestValue = trs.toArray().map(function (d1) {
                            let tdValue = func.getRequestTdData(d1.children("td[th-id=" + d.id + "]"), d.type);
                            return new myString(tdValue).base64UrlEncode().value;
                        }).collect("join", ",");
                        d = d.id + "=" + requestValue;
                        return d;
                    }).collect("join", "&");
                    http.request(settings.url + "Create", requestData).then((result)=> {
                        node.request().children(".create").children(".contain").children(".switch").click();
                        func.read(settings.url);
                        node.createBody().children("table").children("tbody").children("tr").remove();
                    }, (result)=> {
                        alert("create data failed：" + result);
                    });
                }
            });

            //relate create wall
            if (settings.related != "" && $("#" + settings.related).attr("relateCreate") != undefined) {
                $("#" + settings.related).children(".request").children(".relateCreate").wall({
                    "html": ()=> {
                        let createHtml = "<div class='head'>";
                        createHtml += "<button class='add btn btn-info'><i class='fa fa-plus'></i></button>";
                        createHtml += "<button class='minus btn btn-warning'><i class='fa fa-minus'></i></button>";
                        createHtml += "<button class='remove btn btn-danger'><i class='fa fa-times'></i></button>";
                        createHtml += "<button class='submit btn btn-warning'><i class='fa fa-fa-floppy-o'></i>submit</button>";
                        createHtml += "</div>";
                        createHtml += "<div class='body'>";
                        createHtml += "<table class='table table-bordered table-condensed table-hover'><thead><tr>";
                        //attachment
                        if (settings.createWithAttachment) {
                            createHtml += "<td><div>attachment</div></td>";
                        }
                        //filter readonly
                        createHtml += element.data("thArr").filter((d)=> {
                            return !d.readonly;
                        }).filter((d)=> {
                            return !d.noCreate;
                        }).map((d)=> {
                            d = "<td><div>" + d.name + "</div></td>";
                            return d;
                        }).collect("join", "");
                        createHtml += "</tr><tr>";
                        //attachment
                        if (settings.createWithAttachment) {
                            createHtml += "<td></td>";
                        }
                        //filter readonly
                        createHtml += element.data("thArr").filter((d)=> {
                            return !d.readonly;
                        }).filter((d)=> {
                            return !d.noCreate;
                        }).map((d)=> {
                            switch (d.type) {
                                case "float":
                                case "int":
                                    let maxText = (d.numMax == undefined) ? "10^10" : d.numMax;
                                    let minText = (d.numMin == undefined) ? "" : (d.numMin + "到");
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
                node.relateCreateHead().children(".add").delegate("", "click", ()=> {
                    let createHtml = "<tr>";
                    if (settings.createWithAttachment) {
                        let trIndex = node.relateCreateBody().children("table").children("tbody").children("tr").length;
                        createHtml += "<td><div class='addon-upload' title='upload attachment' url='../Table/" + id + "temp/AttachmentTempUpload' postData='index=" + element.data("AttachmentTempIndex") + "&trIndex=" + trIndex + "'></div></td>";
                    }
                    //filter readonly
                    createHtml += element.data("thArr").filter((d)=> {
                        return !d.readonly;
                    }).filter((d)=> {
                        return !d.noCreate;
                    }).map((d)=> {
                        d = func.getRequestTdHtml(d);
                        return d;
                    }).collect("join", "");
                    createHtml += "</tr>";
                    node.relateCreateBody().children("table").children("tbody").append(createHtml);
                    let newSelect = node.relateCreateBody().children("table").children("tbody").children("tr:last").children("td").children(".addon-select");
                    if (element.data("th-data") != undefined) {
                        newSelect.each(function () {
                            let d = element.data("th-data")[$(this).parent().attr("th-id")];
                            d = d.map((d1)=> {
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
                node.relateCreateHead().children(".minus").delegate("", "click", ()=> {
                    node.relateCreateBody().children("table").children("tbody").children("tr:last").remove();
                });
                node.relateCreateHead().children(".remove").delegate("", "click", ()=> {
                    node.relateCreateBody().children("table").children("tbody").children("tr").remove();
                });
                node.relateCreateHead().children(".submit").delegate("", "click", ()=> {
                    let trs = node.relateCreateBody().children("table").children("tbody").children("tr");
                    if (trs.length == 0) {
                        alert("请至少添加一行数据");
                        return;
                    }
                    if (confirm("确定要提交这" + trs.length + "行数据吗?")) {
                        //data validate
                        let isValid = true;
                        for (let i = 0; i < trs.length; i++) {
                            element.data("thArr").relateCallback($(trs[i]).children("td"), function (e1, e2) {
                                let value = func.getRequestTdData($(e2), e1.type);
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
                            }, (d)=> {
                                return d.id;
                            }, (d)=> {
                                return $(d).attr("th-id");
                            });
                        }
                        if (!isValid) {
                            return;
                        }

                        let requestData = element.data("thArr").filter((d)=> {
                            return !(d.readonly || d.noCreate);
                        }).map((d)=> {
                            let requestValue = trs.toArray().map(function (d1) {
                                let tdValue = func.getRequestTdData(d1.children("td[th-id=" + d.id + "]"), d.type);
                                return new myString(tdValue).base64UrlEncode().value;
                            }).collect("join", ",");
                            d = d.id + "=" + requestValue;
                            return d;
                        }).collect("join", "&");
                        http.request(settings.url + "Create", requestData).then((result)=> {
                            $("#" + settings.related).children(".request").children(".create").children(".contain").children(".switch").click();
                            func.read(settings.url);
                            node.relateCreateBody().children("table").children("tbody").children("tr").remove();
                        }, (result)=> {
                            alert("create data failed：" + result);
                        });
                    }
                });
            }

            //update wall
            node.request().children(".update").wall({
                "html": ()=> {
                    let updateHtml = "<div class='head'><button class='submit btn btn-warning'>submit</button></div><div class='body'>";
                    //content table
                    updateHtml += "<table class='content table table-bordered table-condensed table-hover'><thead><tr>";
                    updateHtml += element.data("thArr").map((d)=> {
                        d = "<td><div>" + d.name + "</div></td>";
                        return d;
                    }).collect("join", "");
                    updateHtml += "</tr><tr>";
                    updateHtml += element.data("thArr").map((d)=> {
                        switch (d.type) {
                            case "float":
                            case "int":
                                let maxText = (d.numMax == undefined) ? "10^10" : d.numMax;
                                let minText = (d.numMin == undefined) ? "" : (d.numMin + "到");
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
                    updateHtml += element.data("thArr").map((d)=> {
                        d = "<td><div>" + d.name + "</div></td>";
                        return d;
                    }).collect("join", "");
                    updateHtml += "</tr><tr class='danger'><td colspan='" + element.data("thArr").length + "'>you can set a column value of the table above uniformity</td></tr></thead>";
                    updateHtml += "<tbody><tr class='danger'>";
                    let unityTrHtml = element.data("thArr").map((d)=> {
                        let tdHtml = func.getRequestTdHtml(d);
                        return tdHtml;
                    }).collect("join", "");
                    updateHtml += unityTrHtml;
                    updateHtml += "</tr></tbody></table>";
                    updateHtml += "</div>";
                    return updateHtml;
                },
                "openCallback": ()=> {
                    let checkedArr = [];
                    node.tbodyCheckbox().each(function () {
                        if ($(this).prop("checked")) {
                            checkedArr.push($(this));
                        }
                    });
                    if (checkedArr.length == 0) {
                        alert("请至少勾选一行需要更改的数据");
                        return false;
                    } else {
                        let trHtml = "";
                        for (let i = 0; i < checkedArr.length; i++) {
                            trHtml += "<tr>";
                            trHtml += element.data("thArr").map((d)=> {
                                let tdText = checkedArr[i].parent().parent().children("td[th-id=" + d.id + "]").text();
                                let tdHtml = func.getRequestTdHtml(d, tdText);
                                return tdHtml;
                            }).collect("join", "");
                            trHtml += "</tr>";
                        }
                        node.updateBody().children(".content").children("tbody").html(trHtml);
                        //set default value


                        //set unity tr html
                        let unityHtml = "<tr>" + element.data("thArr").map((d)=> {
                                let tdText = checkedArr[0].parent().parent().children("td[th-id=" + d.id + "]").text();
                                let tdHtml = func.getRequestTdHtml(d, tdText);
                                return tdHtml;
                            }).collect("join", "") + "</tr>";
                        node.updateBody().children(".unity").children("tbody").html(unityHtml);
                        //listen unity tr changed
                        node.updateBody().children(".unity").children("tbody").children("tr").children("td").children("input,select").delegate("", "change", ()=> {
                            let unityChangeThId = $(this).parent().attr("th-id");
                            let unityChangeThValue = $(this).val();
                            let needChangeElement = $(this).parent().parent().parent().parent().parent().children(".content").children("tbody").children("tr").children("td[th-id=" + unityChangeThId + "]");
                            needChangeElement.children("input,select").val(unityChangeThValue);
                        });

                        $(".addon-select").select();
                        $(".addon-datepicker").datepicker();
                        return true;
                    }
                }
            });
            node.updateHead().children(".submit").delegate("", "click", ()=> {
                let trs = node.updateBody().children(".content").children("tbody").children("tr");
                if (confirm("确定要提交这" + trs.length + "行数据吗?")) {
                    let requestData = element.data("thArr").map((d)=> {
                        let requestValue = Array.from(trs).map((d1)=> {
                            let tdValue = func.getRequestTdData($(d1).children("td[th-id=" + d.id + "]"), d.type);
                            return new myString(tdValue).base64UrlEncode().value;
                        }).collect("join", ",");
                        d = d.id + "=" + requestValue;
                        return d;
                    }).collect("join", "&");
                    http.request(settings.url + "Update", requestData).then((result)=> {
                        node.request().children(".update").children(".contain").children(".panel").hide();
                        func.read(settings.url);
                    }, (result)=> {
                        alert("update data failed：" + result);
                    });
                }
            });

            //attachment batch download
            node.request().children(".attachmentBatchDownload").delegate("", "click", ()=> {
                if (confirm("你确定要下载勾选的" + n + "行数据的所有附件吗？")) {
                    let requestData = "batchkey=" + element.data("thArr").filter((d)=> {
                            return d.key;
                        }).map((d)=> {
                            d = selectedTr.map((d1)=> {
                                let tdValue = func.getRequestTdData(d1.children("td[th-id=" + d.id + "]"), d.type);
                                return new myString(tdValue).base64UrlEncode().value;
                            }).collect("join", ",");
                            return d;
                        }).collect("join", "");

                    http.request(settings.url + "AttachmentBatchDownload", requestData).then((result)=> {

                    }, (result)=> {
                        alert("download data failed：" + result);
                    });
                }

            });

            //pagination rows per page select change event
            element.data("rowsPerPage", 10);
            node.pagination().children("select").delegate("", "change", function () {
                let rowsPerPage = $(this).find("option:selected").text();
                element.data("rowsPerPage", rowsPerPage);
                element.data("pageIndex", 0);
                func.refreshDisplay();
            });

            //pagination button click event
            node.pagination().children("button").delegate("", "click", function () {
                if (element.data("filterColumnData") == undefined) {
                    return;
                }
                node.theadCheckbox().prop("checked", false);
                let pageLength = parseInt((element.data("filterColumnData").length - 1) / element.data("rowsPerPage"));
                if ($(this).hasClass("double-left")) {
                    element.data("pageIndex", 0);
                }
                if ($(this).hasClass("left")) {
                    let newPageIndex = (element.data("pageIndex") == 0) ? 0 : (element.data("pageIndex") - 1);
                    element.data("pageIndex", newPageIndex);
                }
                if ($(this).hasClass("right")) {
                    let newPageIndex = (element.data("pageIndex") == pageLength) ? element.data("pageIndex") : (element.data("pageIndex") + 1);
                    element.data("pageIndex", newPageIndex);
                }
                if ($(this).hasClass("double-right")) {
                    element.data("pageIndex", pageLength);
                }
                func.refreshDisplay();
            });

            //thead checkbox click event
            node.theadCheckbox().delegate("", "click", function () {
                if ($(this).prop("checked")) {
                    node.tbodyCheckbox().prop({"checked": true});
                    node.tbodyRow().addClass("info");
                } else {
                    node.tbodyCheckbox().prop({"checked": false});
                    node.tbodyRow().removeClass("info");
                }
            });

            //thead sort
            node.thead().children("tr").children(".content").delegate("", "click", function () {
                func.sort($(this));
            });

            //column filter
            node.columnFilter().select({
                "data": element.data("thArr"), "selectCallback": ()=> {
                    console.log(1);
                    //hide unchecked columns
                    let currentData = node.columnFilter().data("data");
                    currentData.relateCallback(node.theadContent(), (e1, e2)=> {
                        e1["id"] = $(e2).attr("th-id");
                    }, (d)=> {
                        return d.name;
                    }, (d)=> {
                        return $(d).text();
                    });
                    currentData.relateCallback(node.content(), (e1, e2)=> {
                        if (e1.checked) {
                            $(e2).removeClass("hide");
                        } else {
                            $(e2).addClass("hide");
                        }
                    }, (d)=> {
                        return d.id;
                    }, (d)=> {
                        return $(d).attr("th-id");
                    });
                    //update data('thArr')
                    element.data("thArr").relateCallback(currentData, (e1, e2)=> {
                        e1.checked = e2.checked;
                    }, (d)=> {
                        return d.id;
                    }, (d)=> {
                        return d.id;
                    });
                }
            });

            //row filter
            let dateFilterHtml = "";
            if (settings.columnDateKey != undefined) {
                dateFilterHtml += "<label>From</label><div id='" + settings.id + "Start' class='addon-datepicker' type='" + settings.dateFilterType + "' add-num='" + settings.dateStartAddNum + "'></div>";
                dateFilterHtml += "<label>To</label><div id='" + settings.id + "End' class='addon-datepicker' type='" + settings.dateFilterType + "' add-num='" + settings.dateEndAddNum + "'></div>";
            }
            node.rowFilter().wall({
                "html": ()=> {
                    let d = "<div class='dateFilter'>" + dateFilterHtml + "</div>";
                    d += "<div class='head'><button class='btn btn-success'><i class='fa fa-plus'></i>add new filter</button></div>";
                    d += "<div class='body'></div>";
                    return d;
                }
            });
            $(".addon-datepicker").datepicker();
            element.data("row-length", 0);

            //delegate request buttons
            node.request().delegate(".refresh", "click", ()=> {
                func.read(settings.url);
            });
            node.request().delegate(".download", "click", ()=> {
                //thead data
                let checkedArr = element.data("thArr").filter((d)=> {
                    return d.checked;
                });
                let requestData = checkedArr.map((d)=> {
                    return d.name;
                }).collect("join", "\t");
                requestData += "\n";
                if (element.data("filterColumnData") != undefined) {
                    //tbody data
                    requestData += element.data("filterColumnData").map((d)=> {
                        let excelRow = "";
                        for (let i = 0; i < checkedArr.length; i++) {
                            let columnId = checkedArr[i].id;
                            excelRow += (d[columnId]==undefined)?"":d[columnId];
                            if (i != checkedArr.length - 1) {
                                excelRow += "\t";
                            }
                        }
                        return excelRow;
                    }).collect("join", "\n");
                }

                let titleSource = settings.title;
                let requestDataSource = requestData;
                let title = new myString(settings.title).base64UrlEncode().value;
                requestData = new myString(requestData).base64UrlEncode().value;
                requestData = "title=" + title + "&data=" + requestData;
                http.request(settings.url + "Export", requestData).then((result)=> {
                    window.location.href="../Data/"+settings.id+"/"+result;
                }, (result)=> {
                    alert("export data failed:"+result);
                });
            });
            node.request().children(".delete").delegate("", "click", ()=> {
                let selectedArr = [];
                node.tbodyCheckbox().each(function () {
                    if ($(this).prop("checked")) {
                        selectedArr.push($(this).parent().parent().attr("row-index"));
                    }
                });
                if (selectedArr.length == 0) {
                    alert("请至少勾选一行数据");
                    return;
                }
                if (confirm("确定要删除所勾选的" + selectedArr.length + "行数据吗？")) {
                    let requestData = element.data("thArr").map((d)=> {
                        let requestName = d.id;
                        let requestValue = selectedArr.map((d1)=> {
                            d1 = element.data("displayData")[d1 % element.data("rowsPerPage")][requestName];
                            d1 = new myString(d1).base64UrlEncode().value;
                            return d1;
                        }).collect("join", ",");
                        let requestStr = requestName + "=" + requestValue;
                        return requestStr;
                    }).collect("join", "&");
                    func.loading();
                    http.request(settings.url + "Delete", requestData).then((result)=> {
                        func.read(settings.url);
                    }, (result)=> {
                        func.refreshDisplay();
                        alert("delete data failed");
                    });
                } else {
                    return;
                }
            });

            //filter button click event
            element.children(".filter").delegate(".filter", "click", function () {
                if (element.data("data") == undefined) {
                    return;
                }
                let filterColumnData = element.data("data").filter((d)=> {
                    if (settings.columnDateKey != undefined) {
                        let startTime = $("#" + settings.id + "Start").data("data");
                        let endTime = $("#" + settings.id + "End").data("data");
                        if (startTime.split("-").length == 2) {
                            startTime = startTime + "-01";
                        }
                        if (endTime.split("-").length == 2) {
                            endTime = endTime + "-01";
                        }
                        if (!(d[settings.columnDateKey] == date.later(startTime, d[settings.columnDateKey]) && endTime == date.later(endTime, d[settings.columnDateKey]))) {
                            return false;
                        }
                    }

                    let isValid = true;
                    node.rowFilterBodyDiv().each(function () {
                        let values = $(this).children(".addon-select").data("data");
                        //find id by name
                        let name = $(this).children("select").find("option:selected").text();
                        let colunmId = element.data("thArr").filter((d1)=> {
                            if (d1.name == name) {
                                return true;
                            } else {
                                return false;
                            }
                        }).map((d1)=> {
                            return d1.id;
                        }).collect("join", "");
                        values = values.filter((d1)=> {
                            if (d1.checked) {
                                return true;
                            } else {
                                return false;
                            }
                        }).map((d1)=> {
                            return d1.name;
                        });
                        if (values.indexOf(d[colunmId]) == -1) {
                            isValid = false;
                            return false;
                        }
                    });
                    return isValid;
                }).filter((d)=> {
                    if (d == undefined) {
                        return false;
                    } else {
                        return true;
                    }
                });

                //refresh html
                element.data("pageIndex", 0);
                element.data("filterColumnData", filterColumnData);
                func.setCurrentPageHtml();


                //tbody checkbox click event
                node.tbody().children("tr").children(".pre").delegate("input", "click", function () {
                    if ($(this).prop("checked")) {
                        $(this).parent(".pre").parent("tr").addClass("info");
                    } else {
                        $(this).parent(".pre").parent("tr").removeClass("info");
                    }
                });
            });

            //row filter add button click event
            node.rowFilterHead().delegate("button", "click", ()=> {
                //element select
                let row = "<select>";
                row += element.data("thArr").map((d)=> {
                    let d1 = "<option>" + d.name + "</option>";
                    return d1;
                }).collect("join", "");
                row += "</select>";
                //element addon-select
                row += "<div class='addon-select' title='value filter'></div>";
                //element remove button
                row += "<button class='btn btn-danger'><i class='fa fa-times'></i></button>";
                //build row html
                let rowId = element.data("row-length");
                node.rowFilterBody().append("<div row-id='" + rowId + "'>" + row + "</div>");
                element.data("row-length", rowId + 1);
                //init value filter select
                let rowValueSelect = node.rowFilterBody().children("div[row-id=" + rowId + "]").children(".addon-select");
                rowValueSelect.select();
                //when open a filter select,close other filter select
                rowValueSelect.children(".contain").children(".switch").delegate("", "click", function () {
                    let otherRowDiv = $(this).parent().parent().parent().siblings("div");
                    if (otherRowDiv.attr("row-id") != rowId) {
                        otherRowDiv.children(".addon-select").children(".contain").children(".panel").hide();
                    }
                });
                //delegate button select values
                let setSelectValues = function (rowSelect) {
                    let selectedText = rowSelect.find("option:selected").text();
                    //find selected th-id by th-name
                    let selected = element.data("thArr").filter((d)=> {
                        return (d.name == selectedText);
                    });
                    let selectedId = selected[0].id;
                    if (element.data("data") == undefined) {
                        return;
                    }
                    let d = element.data("data").map((d)=> {
                        let v = d[selectedId];
                        return {"name": v, "checked": true};
                    });
                    rowSelect.parent().children("div").select();
                    d = d.filter((d1)=> {
                        if (d1.name == "" || d1.name == undefined) {
                            return false;
                        } else {
                            return true;
                        }
                    });
                    d = d.distinct((d)=> {
                        return d.name;
                    });
                    rowSelect.parent().children("div").select({"data": d});
                }
                //set values when select init or change
                setSelectValues(node.rowFilterBody().children("div[row-id=" + rowId + "]").children("select"));
                $(this).parent().parent().children(".body").children("div").delegate("select", "change", function () {
                    setSelectValues($(this));
                });

                //button remove click event
                node.rowFilterBodyDiv().delegate(".btn-danger", "click", (event)=> {
                    $(this).parent().remove();
                    event.stopPropagation();
                });

            });


            element.data("pageIndex", 0)
        });

        if (options == undefined) {
            return;
        }

        //set data
        if (settings.data != undefined) {
            func.setData(settings.data);
            func.refreshDisplay();
        }

        //request read
        if (settings.read != undefined) {
            element.data("relatedData", (options.relatedData == undefined) ? "" : options.relatedData);
            func.read(options.read);
        }

        //request filter select data
        if (settings.requestFilterData != undefined) {
            node.request().children(".request-filter").each(function () {
                let thisSelect = $(this);
                let selectId = requestFilter.filter((d)=> {
                    return (d[1] == thisSelect.attr("title"));
                }).map(function (d) {
                    return d[0];
                }).collect("join", "");
                $(this).select({"data": settings.requestFilterData[selectId]});
            });
            //add to related element data
            if (settings.relate != "") {
                let parentRelatedData = settings.requestFilterData;
                let oldData = $("#" + relate).data("parentRelatedData");
                $.extend(parentRelatedData, oldData);
                $("#" + relate).data("parentRelatedData", parentRelatedData);
            }
        }

        if (settings.beforeCreateOpenCallback != undefined) {
            node.request().children(".create").wall({"beforeOpenCallback": settings.beforeCreateOpenCallback});
            if (setting.related != "" && $("#" + setting.related).attr("relateCreate") != undefined) {
                $("#" + setting.related).children(".request").children(".relateCreate").wall({"beforeOpenCallback": settings.beforeCreateOpenCallback});
            }
        }
        if (settings.beforeUpdateOpenCallback != undefined) {
            node.request().children(".update").wall({"beforeOpenCallback": settings.beforeUpdateOpenCallback});
        }

        return element;
    }

    }
    ));

/**
 * demo like below
 * <div class='table' table-id='xxx'>
 *     <div key='id'>id</div>
 * </div>
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
        'use strict';
        $.fn.table = function (options) {
            return $(this).each(function () {
                table($(this), options);
            });
        };

        let table = (element, options)=> {
            let curd = element.property("curd", "");
            //default setting
            let settings = element.addonSettingExtend(options, {
                curd: {
                    c: (curd == "") ? true : curd.includes("c"),
                    u: (curd == "") ? true : curd.includes("u"),
                    r: (curd == "") ? true : curd.includes("r"),
                    d: (curd == "") ? true : curd.includes("d")
                },
                export: (element.attr("export") == "false") ? false : true,
                chart: (element.attr("export") == "false") ? false : true,
                //func column,all default true
                funcColumn: {
                    checkbox: (element.attr("checkbox") == "false") ? false : true,
                    lineNumber: (element.attr("lineNumber") == "false") ? false : true,
                    detail: (element.attr("detail") == "false") ? false : true,
                    attachment: (element.attr("attachment") == "false") ? false : true
                },
                title: element.property("table-title", ""),
                id: element.property("table-id", ""),
                url: element.property("url", "../Table/" + element.property("table-id", "") + "/"),
                rowPerPageArr: [5, 10, 15, 20, 25, 50, 100],
                displayRowNum: 10,
                currentRowIndex: 1,
                //a tbody row height
                rowHeight: 40,
                pageIndex: 0,
                chartDataSourceType: "original"

            });

            //table node
            let node = {
                table(){
                    return element.children("table");
                },
                svg(){
                    return element.children(".svg");
                },
                thead(){
                    return element.xPath("table>thead");
                },
                tbody(){
                    return element.xPath("table>tbody");
                },
                left(){
                    return element.xPath(".left");
                },
                right(){
                    return element.xPath(".right");
                },
                request(){
                    return element.xPath(".left>.request");
                },
                filter(){
                    return element.xPath(".left>.filter");
                },
                rowFilterPanel(){
                    return element.xPath(".left>.filter>.row-filter>.row-filter-panel");
                },
                rowPerPageSelect(){
                    return element.xPath(".right>.rowPerPage>select");
                }
            }

            //table functions
            let func = {
                noData(){
                    node.tbody().html(()=> {
                        let tbodyHtml = "<tr><td colspan='" + settings.colNum + "'>there is not any matched data</td></tr>";
                        return tbodyHtml;
                    });
                },
                errorData(){
                    node.tbody().html(()=> {
                        let tbodyHtml = "<tr><td colspan='" + settings.colNum + "'>an error occured when getting data</td></tr>";
                        return tbodyHtml;
                    });
                },
                loading(){
                    node.tbody().html(()=> {
                        let tbodyHtml = "<tr><td colspan='" + settings.colNum + "'><i class='fa fa-refresh'></i></td></tr>";
                        return tbodyHtml;
                    });
                },
                //refresh attachment panel
                attachmentRefresh(attachmentPanel) {
                    func.attachmentLoading(attachmentPanel);

                    let id = attachmentPanel.parent().parent().children("td[name=id]").text();
                    id = new myString(id).base64UrlEncode().value;
                    let requestData = "id=" + id;
                    http.request(settings.url + "AttachmentList", requestData).then(result=> {
                        if (result.length == 0) {
                            func.attachmentNoData(attachmentPanel);
                            return;
                        }

                        let attachmentTbodyHtml = result.map(d=> {
                            let trHtml = "<tr>";
                            trHtml += "<td><input type='checkbox'></td>";
                            trHtml += "<td name='fileName'>" + d.name + "</td>";
                            let size = func.getSizeStr(d.size);
                            trHtml += "<td>" + size + "</td>";
                            trHtml += "<td><i class='fa fa-eye'></i></td>";
                            trHtml += "<td><i class='fa fa-download'></i></td>";
                            trHtml += "</tr>";
                            return trHtml;
                        }).join("");
                        attachmentPanel.xPath(".attachment-panel-body>table>tbody").html(attachmentTbodyHtml);

                        //listen attachment preview button
                        attachmentPanel.xPath(".attachment-panel-body>table>tbody>tr>td>i.fa-eye").delegate("", "click", function () {
                            let fileName = $(this).parent().parent().children("td[name=fileName]").text();
                            fileName = new myString(fileName).base64UrlEncode().value;
                            window.open(settings.url + "AttachmentPreview?fileName=" + fileName + "&id=" + id);
                        });

                        //listen attachment download button
                        attachmentPanel.xPath(".attachment-panel-body>table>tbody>tr>td>i.fa-download").delegate("", "click", function () {
                            let fileName = $(this).parent().parent().children("td[name=fileName]").text();
                            fileName = new myString(fileName).base64UrlEncode().value;
                            window.location.href = settings.url + "AttachmentDownload?fileName=" + fileName + "&id=" + id;
                        });

                        //listen attachment panel thead checkbox
                        attachmentPanel.xPath(".attachment-panel-body>table>thead>tr>th>input[type=checkbox]").delegate("", "click", function () {
                            if ($(this).prop("checked")) {
                                attachmentPanel.xPath(".attachment-panel-body>table>tbody>tr>td>input[type=checkbox]").prop("checked", true);
                            } else {
                                attachmentPanel.xPath(".attachment-panel-body>table>tbody>tr>td>input[type=checkbox]").prop("checked", false);
                            }
                        });

                    }).catch(result=> {
                        attachmentErrorData(attachmentPanel);
                    });
                },
                attachmentLoading(attachmentPanel){
                    //loading
                    attachmentPanel.xPath(".attachment-panel-body>table>tbody").html(()=> {
                        let d = "<tr><td colspan='5'><i class='fa fa-refresh'></i></td></tr>";
                        return d;
                    });
                },
                attachmentNoData(attachmentPanel){
                    attachmentPanel.xPath(".attachment-panel-body>table>tbody").html("<tr><td colspan='5'>there is not any attachment</td></tr>");
                },
                attachmentErrorData(attachmentPanel){
                    attachmentPanel.xPath(".attachment-panel-body>table>tbody").html("<tr><td colspan='5'>an error occured when getting attachment list</td></tr>");
                },
                getSizeStr(size){
                    size = (size / 1024 > 1) ? ((size / 1024).toFixed(2) + "KB") : (size + "B");
                    size = (Number.parseInt(size) / 1024 > 1) ? ((Number.parseInt(size) / 1024).toFixed(2) + "M") : size;
                    return size;
                },
                drawTbody(){
                    //draw row data
                    let rowNum = 1;
                    let tbodyHtml = settings.displayData.map(d=> {
                        let trHtml = settings.funcColumn.checkbox ? "<td class='func'><input type='checkbox'></td>" : "";
                        trHtml += settings.funcColumn.lineNumber ? "<td class='func'>" + rowNum + "</td>" : "";
                        trHtml += settings.funcColumn.detail ? "<td class='func'><i class='fa fa-tablet' title='see all detail row in a new modal'></i></td>" : "";
                        let attachmentHtml = "<i class='fa fa-paperclip' title='attachment panel'></i>";
                        attachmentHtml += "<div class='attachment-panel'>";
                        attachmentHtml += "<div class='attachment-panel-head'>";
                        attachmentHtml += "<button class='button-warning read' title='refresh attachment list'><i class='fa fa-refresh'></i></button>";
                        attachmentHtml += "<button class='button-warning create' title='add a new row to upload an attachment'><i class='fa fa-plus'></i></button>";
                        attachmentHtml += "<div class='attachment-create-panel'><div class='attachment-create-panel-head'>";
                        attachmentHtml += "<button class='button-success add' title='add a new attachment row below'><i class='fa fa-plus'></i></button>";
                        attachmentHtml += "<button class='button-success minus' title='remove the last attachment row below'><i class='fa fa-minus'></i></button>";
                        attachmentHtml += "<button class='button-success revert' title='remove all attachment row below'><i class='fa fa-undo'></i></button>";
                        attachmentHtml += "<button class='button-warning submit' title='upload attachments below to server'>Submit</button>";
                        attachmentHtml += "</div><div class='attachment-create-panel-body'><table>";
                        attachmentHtml += "<thead><tr><th>name</th><th>size</th><th>progress</th></tr></thead><tbody></tbody></table></div></div>";
                        attachmentHtml += "<button class='button-danger delete' title='delete selected attachments'><i class='fa fa-times'></i></button>";
                        attachmentHtml += "</div>";
                        attachmentHtml += "<div class='attachment-panel-body'><table><thead><tr>";
                        attachmentHtml += "<th><input type='checkbox'></th><th>file name</th><th>file size</th><th>preview</th><th>download</th></tr></thead><tbody>";
                        attachmentHtml += "<tr><td colspan='5'>there is not any attachment</td></tr>";
                        attachmentHtml += "</tbody></table></div>";
                        attachmentHtml += "</div>";
                        trHtml += settings.funcColumn.attachment ? ("<td class='func'>" + attachmentHtml + "</td>") : "";
                        trHtml += "<td name='id'>" + d.id + "</td>";
                        trHtml += settings.th.map(d1=> {
                            let k = d1.id;
                            let v = (d[k] == undefined) ? "" : d[k];
                            let classHtml = d1.checked ? "" : " class='hide'";
                            v = (d1.type == "day") ? v.substr(0, 10) : v;
                            d1 = "<td name='" + k + "' type='" + d1.type + "'" + classHtml + ">" + v + "</td>";
                            return d1;
                        }).join("");
                        trHtml = "<tr row='" + rowNum + "'>" + trHtml + "</tr>";
                        rowNum++;
                        return trHtml;
                    }).join("");
                    node.tbody().html(tbodyHtml);

                    //listen detail button
                    node.tbody().xPath("tr>.func>i.fa-tablet").delegate("", "click", function () {
                        let tr = $(this).parent().parent();
                        let modalHtml = "";
                        tr.children("td[name]").each(function () {
                            let name = $(this).attr("name");
                            let d1 = settings.th.find(d=> {
                                return d.id == name;
                            });
                            let tdName = (d1 == undefined) ? "id" : d1.name;
                            let tdHtml = (d1 == undefined) ? "" : func.getTdHtml(d1.type);
                            let tdId = (d1 == undefined) ? "id" : d1.id;
                            let tdType = (d1 == undefined) ? "id" : d1.type;
                            modalHtml += "<div class='row' name='" + tdId + "' type='" + tdType + "'><div class='name'>" + tdName + ":</div><div class='form'>" + tdHtml + "</div></div>";

                        });
                        modalHtml += settings.curd.u ? "<div class='modal-submit'><button class='button-warning' title='update the data above on server'>Submit</button></div>" : "";

                        $(this).modal({
                            width: 0.8,
                            height: 0.8,
                            marginTop: 0.1,
                            html: modalHtml,
                            name: "table"
                        });

                        $("body").xPath(".addon-modal>.modal-panel>.modal-panel-body>.row>.form>.datepicker").datepicker();

                        //set td value
                        $("body").xPath(".addon-modal>.modal-panel>.modal-panel-body>.row").each(function () {
                            let tdId = $(this).attr("name");
                            let tdType = $(this).attr("type");
                            let trTd = tr.children("td[name=" + tdId + "]");
                            if (tdType == "id") {
                                $(this).xPath(".form").text(trTd.text());
                            } else {
                                switch (tdType) {
                                    case "day":
                                    case "month":
                                    case "week":
                                        $(this).xPath(".form>.datepicker").datepicker({"data": new date(trTd.text()).value});
                                        break;
                                    default:
                                        $(this).xPath(".form>input").val(trTd.text());
                                        break;
                                }
                            }
                        });

                        //listen modal submit button
                        $("body").xPath(".addon-modal>.modal-panel>.modal-panel-body>.modal-submit>.button-warning").delegate("", "click", function () {
                            if (confirm("do you really want to update the data above?")) {
                                let requestData = "";
                                $("body").xPath(".addon-modal>.modal-panel>.modal-panel-body>.row").each(function () {
                                    let id = $(this).attr("name");
                                    let type = $(this).attr("type");
                                    let v = "";
                                    if (id == "id") {
                                        v = $(this).children(".form").text();
                                    } else {
                                        switch (type) {
                                            case "day":
                                            case "month":
                                            case "week":
                                                v = $(this).xPath(".form>.datepicker").data("data");
                                                v = new date(v).toString();
                                                break;
                                            default:
                                                v = $(this).xPath(".form>input").val();
                                                break;
                                        }
                                    }
                                    v = new myString(v).base64UrlEncode().value;
                                    requestData += id + "=" + v + "&";
                                });
                                requestData = requestData.substr(0, requestData.length - 2);

                                http.request(settings.url + "Update", requestData).then(result=> {
                                    $("body").xPath(".addon-modal").remove();
                                    func.read();
                                }).catch(result=> {
                                    alert("update data failed:" + result);
                                });
                            }
                        });
                    });


                    //listen attach button
                    node.tbody().xPath("tr>.func>i.fa-paperclip").delegate("", "click", function () {
                        let attachmentPanel = $(this).next(".attachment-panel");
                        if (attachmentPanel.is(":hidden")) {
                            attachmentPanel.show();
                            func.attachmentRefresh(attachmentPanel);
                        } else {
                            attachmentPanel.hide();
                        }
                    });

                    //listen attachment panel head read button
                    node.tbody().xPath("tr>.func>.attachment-panel>.attachment-panel-head>.read").delegate("", "click", function () {
                        func.attachmentRefresh($(this).parent().parent());
                    });

                    //listen attachment panel head add button
                    node.tbody().xPath("tr>.func>.attachment-panel>.attachment-panel-head>.create").delegate("", "click", function () {
                        $(this).next(".attachment-create-panel").toggle();
                    });

                    //listen attachment create panel add button
                    node.tbody().xPath("tr>.func>.attachment-panel>.attachment-panel-head>.attachment-create-panel>.attachment-create-panel-head>.add").delegate("", "click", function () {
                        $(this).parent().parent().xPath(".attachment-create-panel-body>table>tbody").append(()=> {
                            let trHtml = "<tr><td><input type='file'><input class='input' type='text' readonly='readonly' placeholder='select file here'></td>";
                            trHtml += "<td name='size'></td><td name='status'>waiting for upload</td></tr>";
                            return trHtml;
                        });
                        let newTr = $(this).parent().parent().xPath(".attachment-create-panel-body>table>tbody>tr:last");
                        //listen select file button
                        newTr.xPath("td>.input").delegate("", "click", function () {
                            $(this).prev("input[type=file]").click();
                        });
                        //listen file input change
                        newTr.xPath("td>input[type=file]").delegate("", "change", function () {
                            let file = this.files[0];
                            if (file == undefined) {
                                newTr.xPath("td>.input").val("no file selected");
                                newTr.xPath("td[name=size]").text("");
                                return;
                            }
                            let displayName = (file.name.length >= 15) ? (file.name.substr(0, 15) + "...") : file.name;
                            newTr.xPath("td>.input").val(displayName);
                            let size = func.getSizeStr(file.size);
                            newTr.xPath("td[name=size]").text(size);
                        });
                    });

                    //listen attachment create panel minus button
                    node.tbody().xPath("tr>.func>.attachment-panel>.attachment-panel-head>.attachment-create-panel>.attachment-create-panel-head>.minus").delegate("", "click", function () {
                        $(this).parent().parent().xPath(".attachment-create-panel-body>table>tbody>tr:last").remove();
                    });

                    //listen attachment create panel revert button
                    node.tbody().xPath("tr>.func>.attachment-panel>.attachment-panel-head>.attachment-create-panel>.attachment-create-panel-head>.revert").delegate("", "click", function () {
                        $(this).parent().parent().xPath(".attachment-create-panel-body>table>tbody>tr").remove();
                    });

                    //listen attachment create panel submit button
                    node.tbody().xPath("tr>.func>.attachment-panel>.attachment-panel-head>.attachment-create-panel>.attachment-create-panel-head>.submit").delegate("", "click", function () {
                        let tr = $(this).parent().parent().xPath(".attachment-create-panel-body>table>tbody>tr");
                        let attachmentCreatePanel = $(this).parent().parent();
                        let id = $(this).parent().parent().parent().parent().parent().parent().children("td[name=id]").text();
                        id = new myString(id).base64UrlEncode().value;

                        if (tr.length == 0) {
                            alert("please add at least one file for upload");
                            return;
                        }
                        let allHasFile = tr.toArray().every(d=> {
                            d = d.xPath("td>input[type=file]")[0].files[0];
                            d = (d != undefined);
                            return d;
                        });
                        if (!allHasFile) {
                            alert("please ensure all rows has the selected file");
                            return;
                        }

                        let requestData = "id=" + id;
                        let promiseArr = [];

                        //upload all files async each other
                        tr.each(function () {
                            let thisTr = $(this);
                            let uploadPromise = new Promise(function (resolve, reject) {
                                let uploadFile = new FormData();
                                uploadFile.append(0, thisTr.xPath("td>input[type=file]")[0].files[0]);
                                let xhr = new XMLHttpRequest();
                                let status = thisTr.xPath("td[name=status]");
                                status.html("<div class='progress'><div class='percent'></div></div>");
                                xhr.upload.addEventListener("progress", function (evt) {
                                    if (evt.lengthComputable) {
                                        let percentComplete = Math.round(evt.loaded * 100 / evt.total);
                                        status.xPath(".progress").css({"width": percentComplete + "%"});
                                        status.xPath(".progress>.percent").text(percentComplete + "%");
                                    }
                                }, false);
                                xhr.addEventListener("load", function (evt) {
                                    let result = evt.target.responseText;
                                    let jsonObject;
                                    try {
                                        jsonObject = new myString(result).toJson();
                                    } catch (e) {
                                        let rejectMessage = "invalid json message";
                                        status.xPath(".progress>.percent").text(rejectMessage);
                                        reject(rejectMessage);
                                        return;
                                    }
                                    if (jsonObject.success == "true") {
                                        resolve();
                                    } else {
                                        let rejectMessage = "upload failed:" + jsonObject.message;
                                        status.xPath(".progress>.percent").text(rejectMessage);
                                        reject(rejectMessage);
                                    }
                                }, false);
                                xhr.addEventListener("error", function () {
                                    let rejectMessage = "upload failed:check your network";
                                    status.xPath(".progress>.percent").text(rejectMessage);
                                    reject(rejectMessage);
                                }, false);
                                xhr.addEventListener("abort", function () {
                                    let rejectMessage = "upload abort";
                                    status.xPath(".progress>.percent").text(rejectMessage);
                                    reject(rejectMessage);
                                }, false);
                                xhr.open("POST", settings.url + "AttachmentUpload?" + requestData);
                                xhr.send(uploadFile);
                            });
                            promiseArr.push(uploadPromise);
                        });

                        Promise.all(promiseArr).then(result=> {
                            attachmentCreatePanel.hide();
                            func.attachmentRefresh(attachmentCreatePanel.parent().parent());
                        }).catch(result=> {
                            alert(result);
                        })
                    });

                    //listen attachment panel head delete button
                    node.tbody().xPath("tr>.func>.attachment-panel>.attachment-panel-head>.delete").delegate("", "click", function () {
                        let attachmentPanel = $(this).parent().parent();
                        let selectedTr = attachmentPanel.xPath(".attachment-panel-body>table>tbody>tr");
                        selectedTr = selectedTr.toArray().filter(d=> {
                            d = d.xPath("td>input[type=checkbox]").prop("checked");
                            return d;
                        });
                        if (selectedTr.length == 0) {
                            alert("please check at least one box on the left");
                            return;
                        }

                        if (confirm("do you really want to delete selected " + selectedTr.length + " attachments?")) {
                            let id = attachmentPanel.parent().parent().children("td[name=id]").text();
                            id = new myString(id).base64UrlEncode().value;
                            let fileName = selectedTr.map(d=> {
                                d = d.xPath("td[name=fileName]").text();
                                d = new myString(d).base64UrlEncode().value;
                                return d;
                            }).join(",");
                            let requestData = "id=" + id + "&fileName=" + fileName;
                            http.request(settings.url + "AttachmentDelete", requestData).then(result=> {
                                func.attachmentRefresh(attachmentPanel);
                            }).catch(result=> {
                                alert("delete attachment failed:" + result);
                                func.attachmentRefresh(attachmentPanel);
                            });
                        }
                    });


                },
                listenTbodyCheckbox(){
                    //listen tbody checkbox
                    node.tbody().xPath("tr>td.func>input[type=checkbox]").delegate("", "click", function () {
                        if ($(this).prop("checked")) {
                            $(this).prop({"checked": true});
                            $(this).parent().parent().addClass("active");
                        } else {
                            $(this).prop({"checked": false});
                            $(this).parent().parent().removeClass("active");
                        }
                    });
                },
                read(){
                    func.loading();
                    http.request(settings.url + "Read", "").then(result=> {
                        settings.data = result;
                        settings.sortedData = result.concat();
                        settings.displayData = result.slice(0, settings.displayRowNum);
                        if (result.length == 0) {
                            func.noData();
                        } else {
                            func.drawTbody();
                            //turn to first page
                            func.turnPage();
                        }
                        func.listenTbodyCheckbox();
                    }).catch(result=> {
                        func.errorData();
                    });
                },
                sort(cell){
                    let sortId = cell.attr("name");
                    let cellType = settings.th.find(d=> {
                        return d.id == sortId;
                    }).type;
                    let parseCellValue = (d=> {
                        switch (cellType) {
                            case "day":
                            case "month":
                            case "week":
                                d = d[sortId];
                                break;
                            default:
                                d = isNaN(parseFloat(d[sortId])) ? d[sortId] : parseFloat(d[sortId]);
                                break;
                        }
                        return d;
                    });

                    if (cell.children("i").hasClass("fa-sort")) {
                        //unset other column sort
                        cell.siblings("th.content").children("i").attr("class", "fa fa-sort");

                        //no sort to desc
                        cell.children("i").removeClass("fa-sort");
                        cell.children("i").addClass("fa-sort-desc");
                        settings.sortedData.sort(function (a, b) {
                            let va = parseCellValue(a);
                            let vb = parseCellValue(b);
                            return va > vb ? 1 : -1;
                        });
                    } else if (cell.children("i").hasClass("fa-sort-desc")) {
                        //desc to asc
                        cell.children("i").removeClass("fa-sort-desc");
                        cell.children("i").addClass("fa-sort-asc");
                        settings.sortedData.sort(function (a, b) {
                            let va = parseCellValue(a);
                            let vb = parseCellValue(b);
                            return va < vb ? 1 : -1;
                        });
                    } else {
                        //asc to no sort
                        cell.children("i").removeClass("fa-sort-asc");
                        cell.children("i").addClass("fa-sort");
                        settings.sortedData = settings.data.concat();
                    }
                    settings.displayData = settings.sortedData.slice(settings.pageIndex * settings.displayRowNum, (settings.pageIndex + 1) * settings.displayRowNum);
                    func.drawTbody();
                },
                getSelectRowArr(){
                    let selectedTrArr = [];
                    node.tbody().xPath("tr>td.func>input[type=checkbox]").each(function () {
                        if ($(this).prop("checked")) {
                            selectedTrArr.push($(this).parent().parent());
                        }
                    });
                    return selectedTrArr;
                },
                getTdHtml(type){
                    let tdHtml;
                    switch (type) {
                        case "day":
                        case "month":
                        case "week":
                            let typeHtml = " type='" + type + "'";
                            tdHtml = "<div class='datepicker'" + typeHtml + "></div>";
                            break;
                        case "input":
                        default:
                            tdHtml = "<input type='text' class='input'>";
                            break;
                    }
                    return tdHtml;
                },
                getTdValue(td, type){
                    let tdValue;
                    switch (type) {
                        case "day":
                        case "week":
                            tdValue = td.children(".datepicker").data("data");
                            tdValue = new date(tdValue).toString();
                            break;
                        case "month":
                            tdValue = td.children(".datepicker").data("data");
                            tdValue = new date(tdValue).toString("month") + "-01";
                            break;
                        case "input":
                        default:
                            tdValue = td.children("input").val();
                            break;
                    }
                    return tdValue;
                },
                turnPage(){
                    //set total
                    let total = (settings.sortedData == undefined) ? 0 : settings.sortedData.length;
                    node.right().xPath(".rowPerPage>label").text(total);
                    node.right().xPath(".pagination>label").text(Math.ceil(total / settings.displayRowNum));
                    //set page index
                    node.right().xPath(".pagination>.page").val(settings.pageIndex + 1);

                    func.setDisplayData();
                    func.drawTbody();
                },
                setDisplayData(){
                    let start = settings.displayRowNum * settings.pageIndex;
                    let end = settings.displayRowNum * (settings.pageIndex + 1);
                    settings.displayData = settings.sortedData.slice(start, end);
                },
                setYAxisSelectData(data){
                    let yAxisData = settings.th.filter(d=> {
                        //checking if data is number
                        let isNumber = (data.length == 0) ? false : data.every(d1=> {
                            let v = d1[d.id];
                            if (v == undefined) {
                                return false;
                            }
                            let regex = /(^\d+$)|(^\d+.\d+$)/g;
                            return v.match(regex);
                        });
                        return isNumber;
                    }).map(d=> {
                        d.checked = true;
                        return d;
                    });
                    node.filter().xPath(".chart>.chart-panel>.chart-panel-body>.row>.select").select({
                        "data": yAxisData
                    });
                }

            }

            //table init
            element.addonInit("table", function () {
                //get thead
                settings.th = [];
                element.children("div[key]").each(function () {
                    settings.th.push({
                        id: $(this).attr("key"),
                        name: $(this).text(),
                        type: $(this).property("type", "input"),
                        hide: $(this).has("hide")
                    });
                });
                let theadContentHtml = settings.th.map(d=> {
                    let classHtml = d.hide ? " hide" : "";
                    d = "<th class='content" + classHtml + "' name='" + d.id + "'><i class='fa fa-sort'></i>" + d.name + "</th>";
                    return d;
                }).join("");
                let theadHtml = "<thead><tr>";
                theadHtml += settings.funcColumn.checkbox ? "<th class='func'><input type='checkbox'></th>" : "";
                theadHtml += settings.funcColumn.lineNumber ? "<th class='func'>line</th>" : "";
                theadHtml += settings.funcColumn.detail ? "<th class='func'>detail</th>" : "";
                theadHtml += settings.funcColumn.attachment ? "<th class='func'>attach</th>" : "";
                theadHtml += "<th class='content' name='id'>rowId</th>";
                theadHtml += theadContentHtml + "</tr></thead>";

                //colNum
                let funcColumnLength = 0;
                for (let k in settings.funcColumn) {
                    if (settings.funcColumn[k]) {
                        funcColumnLength++;
                    }
                }
                settings.colNum = settings.th.length + funcColumnLength;

                //append html
                element.append(()=> {
                    let headHtml = "<div class='switch'>";
                    headHtml += "<div><i class='fa fa-table'></i></div>";
                    headHtml += "<div><i class='fa fa-line-chart'></i></div>";
                    headHtml += "</div>";

                    let requestHtml = "<div class='request'>";
                    let readHtml = "<button class='read button-warning' title='refresh data from server'><i class='fa fa-refresh'></i></button>";
                    readHtml = settings.curd.r ? readHtml : "";
                    requestHtml += readHtml;

                    let createHtml = "<div class='create'><button class='button-warning' title='create new row data'><i class='fa fa-plus'></i></button>";
                    createHtml += "<div class='create-panel'><div class='create-panel-head'>";
                    createHtml += "<button class='add-button button-success' title='add a new row below'><i class='fa fa-plus'></i></button>";
                    createHtml += "<button class='minus-button button-success' title='remove the last row below'><i class='fa fa-minus'></i></button>";
                    createHtml += "<button class='revert-button button-success' title='remove all row below'><i class='fa fa-undo'></i></button>";
                    createHtml += "<button class='submit-button button-warning' title='add the data below to server'>Submit</button>";
                    createHtml += "</div><div class='create-panel-body'>";
                    createHtml += "<table class='submit-table'><thead>";
                    createHtml += settings.th.map(d=> {
                        d = "<th>" + d.name + "</th>";
                        return d;
                    }).join("");
                    createHtml += "</thead><tbody></tbody></table>";
                    //create unify table
                    createHtml += "<div class='unify'>you can unify all rows data at the below table";
                    createHtml += "<table class='unify-table'><thead>";
                    createHtml += settings.th.map(d=> {
                        d = "<th>" + d.name + "</th>";
                        return d;
                    }).join("");
                    createHtml += "</thead><tbody><tr>";
                    createHtml += settings.th.map(d=> {
                        d = "<td name='" + d.id + "'>" + func.getTdHtml(d.type) + "</td>";
                        return d;
                    }).join("");
                    createHtml += "</tr></tbody></table></div>";

                    createHtml += "</div></div></div>";
                    createHtml = settings.curd.c ? createHtml : "";

                    requestHtml += createHtml;

                    let updateHtml = "<div class='update'><button class='button-warning' title='update selected rows'><i class='fa fa-pencil-square-o'></i></button>";
                    updateHtml += "<div class='update-panel'><div class='update-panel-head'>";
                    updateHtml += "<button class='submit-button button-warning' title='update the data below on server'>Submit</button>";
                    updateHtml += "</div><div class='update-panel-body'>";
                    updateHtml += "<table class='submit-table'><thead>";
                    updateHtml += settings.th.map(d=> {
                        d = "<th>" + d.name + "</th>";
                        return d;
                    }).join("");
                    updateHtml += "</thead><tbody></tbody></table>";
                    //update unify table
                    updateHtml += "<div class='unify'>you can unify all rows data at the below table";
                    updateHtml += "<table class='unify-table'><thead>";
                    updateHtml += settings.th.map(d=> {
                        d = "<th>" + d.name + "</th>";
                        return d;
                    }).join("");
                    updateHtml += "</thead><tbody><tr>";
                    updateHtml += settings.th.map(d=> {
                        d = "<td name='" + d.id + "'>" + func.getTdHtml(d.type) + "</td>";
                        return d;
                    }).join("");
                    updateHtml += "</tr></tbody></table></div>";

                    updateHtml += "</div></div></div>";
                    updateHtml = settings.curd.u ? updateHtml : "";
                    requestHtml += updateHtml;

                    let copyHtml = "<div class='copy'><button class='button-warning' title='create new data with the selected Initially data'><i class='fa fa-files-o'></i></button>";
                    copyHtml += "<div class='copy-panel'><div class='copy-panel-head'>";
                    copyHtml += "<button class='submit-button button-warning' title='create the data below on server'>Submit</button>";
                    copyHtml += "</div><div class='copy-panel-body'>";
                    copyHtml += "<table class='submit-table'><thead>";
                    copyHtml += settings.th.map(d=> {
                        d = "<th>" + d.name + "</th>";
                        return d;
                    }).join("");
                    copyHtml += "</thead><tbody></tbody></table>";
                    copyHtml += "</div></div></div>";
                    copyHtml = settings.curd.c ? copyHtml : "";
                    requestHtml += copyHtml;

                    let exportHtml = "<button class='export button-warning' title='export selected rows to excel'><i class='fa fa-download'></i></button>";
                    exportHtml = settings.export ? exportHtml : "";
                    requestHtml += exportHtml;

                    let batchAttachHtml = "<button class='batchAttach button-warning' title='download all attachments of selected rows below'><i class='fa fa-paperclip'></i></button>";
                    batchAttachHtml = settings.attachment ? batchAttachHtml : "";
                    requestHtml += batchAttachHtml;

                    let deleteHtml = "<button class='delete button-danger' title='delete selected rows on server'><i class='fa fa-times'></i></button>";
                    deleteHtml = settings.curd.d ? deleteHtml : "";
                    requestHtml += deleteHtml;


                    requestHtml += "</div>";

                    let filterHtml = "<div class='filter'>";
                    filterHtml += "<div class='column-filter' name='column' title='column filter'></div>";
                    let rowFilterHtml = "<div class='row-filter' title='row filter'><button class='button-info'>row<i class='fa fa-check-square-o'></i></button>";
                    rowFilterHtml += "<div class='row-filter-panel'>";
                    rowFilterHtml += "<div class='row-filter-panel-head'><button class='add-button button-success'><i class='fa fa-plus'></i>add new filter</button>";
                    rowFilterHtml += "<button class='filter-button button-success'><i class='fa fa-filter'></i>filter</button></div>";
                    rowFilterHtml += "<div class='row-filter-panel-body'></div>";
                    rowFilterHtml += "</div>";
                    rowFilterHtml += "</div>";
                    filterHtml += rowFilterHtml;

                    filterHtml += "<input class='singleFilter input' placeholder='single filter'>";
                    filterHtml += "<button class='revert button-info' title='revert data before filter row'><i class='fa fa-undo'></i></button>";
                    filterHtml += "<div class='chart'>";
                    filterHtml += "<button class='button-info' title=''><i class='fa fa-line-chart'></i></button>";
                    filterHtml += "<div class='chart-panel'><div class='chart-panel-head'><button class='button-success'><i class='fa fa-paint-brush'></i></button></div>";
                    filterHtml += "<div class='chart-panel-body'><div class='row dataSource'><label>data source:</label><select>";
                    let dataSourceTypeArr = [{
                        "text": "all original row data",
                        "value": "original"
                    }, {"text": "data after filtering", "value": "filter"}, {
                        "text": "selected row data",
                        "value": "selected"
                    }];
                    filterHtml += dataSourceTypeArr.map(d=> {
                        d = "<option value='" + d.value + "'>" + d.text + "</option>";
                        return d;
                    }).join("");
                    filterHtml += "</select></div><div class='row xAxis'><label>x axis:</label><select>";
                    filterHtml += settings.th.map(d=> {
                        d = "<option value='" + d.id + "'>" + d.name + "</option>";
                        return d;
                    }).join("");
                    filterHtml += "</select></div>";
                    filterHtml += "<div class='row yAxis'><label>y axis:</label><div class='select' name='y axis' title='select all your y axis'></div></div></div></div>";
                    filterHtml += "</div>";
                    filterHtml += "</div>";
                    let leftHtml = "<div class='left'>" + requestHtml + filterHtml + "</div>";

                    let rowPerPageHtml = settings.rowPerPageArr.map(d=> {
                        let selectedHtml = (d == settings.displayRowNum) ? " selected='selected'" : "";
                        d = "<option" + selectedHtml + ">" + d + "</option>";
                        return d;
                    }).join("");
                    rowPerPageHtml = "<div class='rowPerPage'>Total Row : <label>0</label> | Row Per Page : <select>" + rowPerPageHtml + "</select></div>";
                    let paginationHtml = "<div class='pagination'>";
                    paginationHtml += "Total page : <label></label> | ";
                    paginationHtml += "<button class='button-info'><i class='fa fa-angle-double-left'></i></button>";
                    paginationHtml += "<button class='button-info'><i class='fa fa-angle-left'></i></button>";
                    paginationHtml += "<input class='page'>";
                    paginationHtml += "<button class='button-info'><i class='fa fa-angle-right'></i></button>";
                    paginationHtml += "<button class='button-info'><i class='fa fa-angle-double-right'></i></button>";
                    paginationHtml += "</div>";
                    let rightHtml = "<div class='right'>" + rowPerPageHtml + paginationHtml + "</div>";

                    let tableHtml = "<table>" + theadHtml + "<tbody></tbody></table>";

                    let chartHtml = "<div class='svg'></div>";
                    // return headHtml + leftHtml + rightHtml + tableHtml + chartHtml;
                    return leftHtml + rightHtml + tableHtml + chartHtml;
                });

                // element.children(".switch").switch();

                //listen unify table
                let createUnifyTd = node.request().xPath(".create>.create-panel>.create-panel-body>.unify>.unify-table>tbody>tr>td");
                let updateUnifyTd = node.request().xPath(".update>.update-panel>.update-panel-body>.unify>.unify-table>tbody>tr>td");
                [createUnifyTd, updateUnifyTd].map(d=> {
                    d.children(".datepicker").each(function () {
                        let thisD = $(this);
                        $(this).datepicker({
                            callback: function () {
                                let unifyId = thisD.parent().attr("name");
                                let unifyValue = thisD.data("data");
                                thisD.parent().parent().parent().parent().parent().parent().xPath(".submit-table>tbody>tr>td[name=" + unifyId + "]>.datepicker").datepicker({
                                    data: unifyValue
                                });
                            }
                        });
                    });

                    d.children("input[type=text]").delegate("", "input", function () {
                        let unifyId = $(this).parent().attr("name");
                        let unifyValue = $(this).val();
                        $(this).parent().parent().parent().parent().parent().parent().xPath(".submit-table>tbody>tr>td[name=" + unifyId + "]>input[type=text]").val(unifyValue);
                    });
                });


                //listen column filter
                node.filter().children(".column-filter").select({
                    data: settings.th.map(d=> {
                        d.checked = !d.hide;
                        return d;
                    }),
                    callback: ()=> {
                        let selectCallback = (cell)=> {
                            let thId = cell.attr("name");
                            let columnFilterData = node.filter().children(".column-filter").data("data");
                            let findData = columnFilterData.find(d=> {
                                return (d.id == thId);
                            });
                            if (findData == undefined) {
                                return;
                            }
                            let isChecked = findData.checked;
                            if (isChecked) {
                                cell.removeClass("hide");
                            } else {
                                cell.addClass("hide");
                            }
                        }
                        node.thead().xPath("tr>th.content").each(function () {
                            selectCallback($(this));
                        });
                        node.tbody().xPath("tr>td[name]").each(function () {
                            selectCallback($(this));
                        });
                    }
                });

                func.noData();


                //auto do read
                func.read();

                element.data("setting", settings);

                //listen row per page select
                node.rowPerPageSelect().delegate("", "change", function () {
                    settings.displayRowNum = node.rowPerPageSelect().children("option:selected").text();
                    settings.pageIndex = 0;
                    func.setDisplayData();
                    func.turnPage();
                });

                //listen read button
                node.request().xPath(".read").delegate("", "click", function () {
                    func.read();
                });

                //listen create button
                node.request().xPath(".create>button").delegate("", "click", function () {
                    node.request().xPath(".create>.create-panel").toggle();
                });

                //listen create panel add button
                node.request().xPath(".create>.create-panel>.create-panel-head>.add-button").delegate("", "click", function () {
                    let createPanelTbody = node.request().xPath(".create>.create-panel>.create-panel-body>.submit-table>tbody");
                    createPanelTbody.append(()=> {
                        let newRowHtml = "<tr>";
                        newRowHtml += settings.th.map(d=> {
                            d = "<td name='" + d.id + "'>" + func.getTdHtml(d.type) + "</td>";
                            return d;
                        }).join("");
                        newRowHtml += "</tr>";
                        return newRowHtml;
                    });
                    createPanelTbody.xPath("tr:last>td>.datepicker").datepicker();
                });

                //listen create panel minus button
                node.request().xPath(".create>.create-panel>.create-panel-head>.minus-button").delegate("", "click", function () {
                    node.request().xPath(".create>.create-panel>.create-panel-body>.submit-table>tbody>tr:last").remove();
                });

                //listen create panel revert button
                node.request().xPath(".create>.create-panel>.create-panel-head>.revert-button").delegate("", "click", function () {
                    node.request().xPath(".create>.create-panel>.create-panel-body>.submit-table>tbody>tr").remove();
                });

                //listen create panel submit button
                node.request().xPath(".create>.create-panel>.create-panel-head>.submit-button").delegate("", "click", function () {
                    let tr = node.request().xPath(".create>.create-panel>.create-panel-body>.submit-table>tbody>tr");
                    if (tr.length == 0) {
                        alert("please add at least one row");
                        return;
                    }

                    if (confirm("do you want to create the " + tr.length + " row data below ?")) {
                        let requestData = settings.th.map(d=> {
                            let data = d.id + "=";
                            data += tr.toArray().map(d1=> {
                                d1 = d1.children("td[name=" + d.id + "]");
                                d1 = func.getTdValue(d1, d.type);
                                d1 = new myString(d1).base64UrlEncode().value;
                                return d1;
                            }).join(",");
                            return data;
                        }).join("&");

                        http.request(settings.url + "Create", requestData).then(result=> {
                            node.request().xPath(".create>.create-panel").hide();
                            func.read();
                        }).catch(result=> {
                            alert("create data failed:" + result);
                        });
                    }

                });

                //listen update button
                node.request().xPath(".update>button").delegate("", "click", function () {
                    let updatePanel = node.request().xPath(".update>.update-panel");
                    if (updatePanel.is(":hidden")) {
                        let selectedRowArr = func.getSelectRowArr();
                        if (selectedRowArr.length == 0) {
                            alert("please check at least one box on the left ");
                            return;
                        }
                        let updatePanelTbody = updatePanel.xPath(".update-panel-body>.submit-table>tbody");
                        updatePanelTbody.html(()=> {
                            let updatePanelTbodyHtml = selectedRowArr.map(row=> {
                                let rowHtml = "<tr>";
                                rowHtml += "<td name='id'>" + row.children("td[name=id]").text() + "</td>";
                                rowHtml += settings.th.map(d=> {
                                    d = "<td name='" + d.id + "'>" + func.getTdHtml(d.type) + "</td>";
                                    return d;
                                }).join("");
                                rowHtml += "</tr>";
                                return rowHtml;
                            }).join("");
                            return updatePanelTbodyHtml;
                        });
                        updatePanelTbody.children("tr").each(function (i) {
                            let selectTr = selectedRowArr[i];
                            let updateTr = $(this);
                            selectTr.children("td").each(function () {
                                let name = $(this).attr("name");
                                let type = $(this).attr("type");
                                switch (type) {
                                    case "day":
                                    case "month":
                                    case "week":
                                        updateTr.xPath("td[name=" + name + "]>.datepicker").datepicker({
                                            "data": $(this).text()
                                        });
                                        break;
                                    default:
                                        updateTr.xPath("td[name=" + name + "]>input").val($(this).text());
                                        break;
                                }

                            });

                        })

                        updatePanelTbody.xPath("tr>td>.datepicker").datepicker();
                        updatePanel.show();
                    } else {
                        updatePanel.hide();
                    }


                });

                //listen update panel submit button
                node.request().xPath(".update>.update-panel>.update-panel-head>.submit-button").delegate("", "click", function () {
                    let tr = node.request().xPath(".update>.update-panel>.update-panel-body>.submit-table>tbody>tr");
                    if (tr.length == 0) {
                        alert("please update at least one row");
                        return;
                    }

                    if (confirm("do you want to update the " + tr.length + " row data below ?")) {
                        let requestData = "id=" + tr.children("td[name=id]").toArray().map(d=> {
                                let id = d.text();
                                id = new myString(id).base64UrlEncode().value;
                                return id;
                            }).join(",");
                        requestData += "&";
                        requestData += settings.th.map(d=> {
                            let data = d.id + "=";
                            data += tr.toArray().map(d1=> {
                                d1 = d1.children("td[name=" + d.id + "]");
                                d1 = func.getTdValue(d1, d.type);
                                d1 = new myString(d1).base64UrlEncode().value;
                                return d1;
                            }).join(",");
                            return data;
                        }).join("&");

                        http.request(settings.url + "Update", requestData).then(result=> {
                            node.request().xPath(".update>.update-panel").hide();
                            func.read();
                        }).catch(result=> {
                            alert("update data failed:" + result);
                        });
                    }
                });

                //listen copy button
                node.request().xPath(".copy>button").delegate("", "click", function () {
                    let copyPanel = node.request().xPath(".copy>.copy-panel");
                    if (copyPanel.is(":hidden")) {
                        let selectedRowArr = func.getSelectRowArr();
                        if (selectedRowArr.length == 0) {
                            alert("please check at least one box on the left ");
                            return;
                        }

                        let copyPanelTbody = copyPanel.xPath(".copy-panel-body>.submit-table>tbody");
                        copyPanelTbody.html(()=> {
                            let copyPanelTbodyHtml = selectedRowArr.map(row=> {
                                let rowHtml = "<tr>";
                                rowHtml += "<td name='id'>" + row.children("td[name=id]").text() + "</td>";
                                rowHtml += settings.th.map(d=> {
                                    d = "<td name='" + d.id + "'>" + func.getTdHtml(d.type) + "</td>";
                                    return d;
                                }).join("");
                                rowHtml += "</tr>";
                                return rowHtml;
                            }).join("");
                            return copyPanelTbodyHtml;
                        });

                        copyPanelTbody.children("tr").each(function (i) {
                            let selectTr = selectedRowArr[i];
                            let copyTr = $(this);
                            selectTr.children("td").each(function () {
                                let name = $(this).attr("name");
                                let type = $(this).attr("type");
                                switch (type) {
                                    case "day":
                                    case "month":
                                    case "week":
                                        copyTr.xPath("td[name=" + name + "]>.datepicker").datepicker({
                                            "data": $(this).text()
                                        });
                                        break;
                                    default:
                                        copyTr.xPath("td[name=" + name + "]>input").val($(this).text());
                                        break;
                                }
                            });
                        })
                        copyPanelTbody.xPath("tr>td>.datepicker").datepicker();
                        copyPanel.show();
                    } else {
                        copyPanel.hide();
                    }

                });

                //listen copy panel submit button
                node.request().xPath(".copy>.copy-panel>.copy-panel-head>.submit-button").delegate("", "click", function () {
                    let tr = node.request().xPath(".copy>.copy-panel>.copy-panel-body>.submit-table>tbody>tr");
                    if (tr.length == 0) {
                        alert("please create at least one row");
                        return;
                    }

                    if (confirm("do you want to create the " + tr.length + " row data below ?")) {

                        let requestData = settings.th.map(d=> {
                            let data = d.id + "=";
                            data += tr.toArray().map(d1=> {
                                d1 = d1.children("td[name=" + d.id + "]");
                                d1 = func.getTdValue(d1, d.type);
                                d1 = new myString(d1).base64UrlEncode().value;
                                return d1;
                            }).join(",");
                            return data;
                        }).join("&");

                        http.request(settings.url + "Create", requestData).then(result=> {
                            node.request().xPath(".copy>.copy-panel").hide();
                            func.read();
                        }).catch(result=> {
                            alert("copy data failed:" + result);
                        });
                    }
                });

                //listen export button
                node.request().xPath(".export").delegate("", "click", function () {
                    let selectedRow = func.getSelectRowArr();
                    if (selectedRow.length == 0) {
                        alert("please check at least one box on the left");
                        return;
                    }

                    if (confirm("do you really want to export selected " + selectedRow.length + " rows to excel?")) {
                        let title = new myString(settings.title).base64UrlEncode().value;
                        let data = settings.th.map(d=> {
                            d = node.thead().xPath("tr>th[name=" + d.id + "]").text();
                            return d;
                        }).join("\t");
                        data += "\n" + selectedRow.map(d=> {
                                d = settings.th.map(d1=> {
                                    d1 = d.children("td[name=" + d1.id + "]").text();
                                    return d1;
                                }).join("\t");
                                return d;
                            }).join("\n");
                        data = new myString(data).base64UrlEncode().value;

                        let requestData = "title=" + title + "&data=" + data;

                        http.request(settings.url + "ExportCreate", requestData).then(result=> {
                            let fileName = settings.title;
                            fileName = new myString(fileName).base64UrlEncode().value;
                            window.location.href = settings.url + "ExportDownload?fileName=" + fileName;
                        }).catch(result=> {
                            alert("export excel failed:" + result);
                        });
                    }
                });

                //listen attachment batch download button
                node.request().xPath(".batchAttach").delegate("", "click", function () {
                    let selectedRows = func.getSelectRowArr();
                    if (selectedRows.length == 0) {
                        alert("please check at least one box on the left");
                        return;
                    }

                    if (confirm("do you really want to download all the selected " + selectedRows.length + " rows attachments?")) {
                        let requestData = "id=" + selectedRows.map(d=> {
                                d = d.children("td[name=id]").text();
                                d = new myString(d).base64UrlEncode().value;
                                return d;
                            }).join(",");
                        $(this).children("i").addClass("rotate");
                        http.request(settings.url + "AttachmentBatchCreate", requestData).then(result=> {
                            $(this).children("i").removeClass("rotate");
                            window.location.href = settings.url + "AttachmentBatchDownload";
                        }).catch(result=> {
                            $(this).children("i").removeClass("rotate");
                            alert("batch download attachments failed:" + result);
                        });
                    }

                });

                //listen delete button
                node.request().xPath(".delete").delegate("", "click", function () {
                    let selectedRowArr = func.getSelectRowArr();
                    if (selectedRowArr.length == 0) {
                        alert("please check at least one box on the left ");
                        return;
                    }
                    if (confirm("do you really want to delete selected " + selectedRowArr.length + " rows?")) {
                        let requestData = "id=";
                        requestData += selectedRowArr.map(d=> {
                            let id = d.children("td[name=id]").text();
                            d = new myString(id).base64UrlEncode().value;
                            return d;
                        }).join(",");
                        http.request(settings.url + "Delete", requestData).then(result=> {
                            func.read();
                        }).catch(result=> {
                            alert("delete data failed:" + result);
                        });
                    }

                });


                //listen thead checkbox
                node.thead().xPath("tr>th.func>input[type=checkbox]").delegate("", "click", function () {
                    if ($(this).prop("checked")) {
                        node.tbody().xPath("tr>td.func>input[type=checkbox]").prop({"checked": true});
                        node.tbody().children("tr").addClass("active");
                    } else {
                        node.tbody().xPath("tr>td.func>input[type=checkbox]").prop({"checked": false});
                        node.tbody().children("tr").removeClass("active");
                    }
                });

                //listen thead click
                node.thead().xPath("tr>th.content").delegate("", "click", function () {
                    func.sort($(this));
                });

                //listen row filter
                node.filter().xPath(".row-filter>button").delegate("", "click", function () {
                    $(this).parent().children(".row-filter-panel").toggle();
                });

                //listen row filter add button
                node.rowFilterPanel().xPath(".row-filter-panel-head>.add-button").delegate("", "click", function () {
                    node.rowFilterPanel().children(".row-filter-panel-body").append(()=> {
                        let rowHtml = "<div class='row'><select>";
                        rowHtml += settings.th.map(d=> {
                            d = "<option>" + d.name + "</option>";
                            return d;
                        }).join("");
                        rowHtml += "</select><div class='value'></div><button class='button-minus'><i class='fa fa-times'></i></button>";
                        rowHtml += "</div>";
                        return rowHtml;
                    });

                    //addon select
                    let setAddonSelect = (rowAddonSelect)=> {
                        let addonSelectColumnName = rowAddonSelect.parent().children("select").children("option:selected").text();
                        let addonSelectId = settings.th.find(d=> {
                            return d.name == addonSelectColumnName;
                        }).id;
                        let i = 0;
                        let addonSelectData = settings.data.distinct(d=> {
                            return d[addonSelectId];
                        }).map(d=> {
                            d = {id: i, name: d[addonSelectId], checked: true};
                            i++;
                            return d;
                        });
                        rowAddonSelect.select({
                            data: addonSelectData
                        });
                    }

                    //listen name select change
                    node.rowFilterPanel().children(".row-filter-panel-body").children(".row:last").children("select").delegate("", "change", function () {
                        let columnName = $(this).children("option:selected").text();
                        setAddonSelect($(this).parent().children(".value"));
                    });

                    //listen row filter delete button
                    node.rowFilterPanel().xPath(".row-filter-panel-body>.row>.button-minus").delegate("", "click", function () {
                        $(this).parent().remove();
                    });

                    let newSelect = node.rowFilterPanel().children(".row-filter-panel-body").children(".row:last").children(".value");
                    setAddonSelect(newSelect);


                });

                //listen row filter filter button
                node.rowFilterPanel().xPath(".row-filter-panel-head>.filter-button").delegate("", "click", function () {
                    let data = settings.data.concat();
                    node.rowFilterPanel().xPath(".row-filter-panel-body>.row").each(function () {
                        let filterId = settings.th.find(d=> {
                            return d.name == $(this).children("select").children("option:selected").text();
                        }).id;
                        let filterData = $(this).children(".value").data("data").filter(d=> {
                            return d.checked;
                        });
                        data = data.filter(d=> {
                            let findData = filterData.find(d1=> {
                                return d1.name == d[filterId];
                            });
                            return findData != undefined;
                        });
                    });
                    settings.sortedData = data;

                    //close current panel
                    node.rowFilterPanel().xPath(".row-filter-panel-body>.row>.value>.select-panel").hide();
                    node.rowFilterPanel().hide();

                    settings.pageIndex = 0;
                    func.turnPage();
                });

                //listen single filter
                node.filter().children(".singleFilter").delegate("", "input", function () {
                    let filterStr = $(this).val();
                    settings.sortedData = settings.data.filter(d=> {
                        let isMatched = Object.keys(d).some(d1=> {
                            if (typeof (d[d1]) == "string" || typeof (d[d1]) == "number") {
                                d1 = d[d1].includes(filterStr);
                            } else {
                                d1 = false;
                            }
                            return d1;
                        });
                        return isMatched;
                    }).concat();
                    settings.pageIndex = 0;
                    func.turnPage();

                });

                //listen revert button
                node.filter().children(".revert").delegate("", "click", function () {
                    settings.sortedData = settings.data.concat();
                    settings.pageIndex = 0;
                    node.filter().children(".singleFilter").val("");
                    func.turnPage();
                });

                //listen chart button
                node.filter().xPath(".chart>button").delegate("", "click", function () {
                    let chartPanle = $(this).next(".chart-panel");
                    if (chartPanle.is(":hidden")) {
                        func.setYAxisSelectData(settings.data);
                        chartPanle.show();
                    } else {
                        chartPanle.hide();
                    }
                });

                //listen dataSource type change
                node.filter().xPath(".chart>.chart-panel>.chart-panel-body>.dataSource>select").delegate("", "change", function () {
                    let sourceType = node.filter().xPath(".chart>.chart-panel>.chart-panel-body>.dataSource>select>option:selected").val();
                    let data;
                    switch (sourceType) {
                        case "original":
                            data = settings.data.concat();
                            break;
                        case "filter":
                            data = settings.sortedData.concat();
                            break;
                        default:
                            let selectArr = func.getSelectRowArr();
                            if (selectArr.length == 0) {
                                alert("please check at least one box on the left");
                                node.filter().xPath(".chart>.chart-panel>.chart-panel-body>.dataSource>select").val(settings.chartDataSourceType);
                                return;
                            }
                            let idArr = selectArr.map(d=> {
                                d = d.children("td[name=id]").text();
                                return d;
                            });
                            data = idArr.map(d=> {
                                d = settings.data.find(d1=> {
                                    return d1.id == d;
                                });
                                return d;
                            });
                            break;
                    }
                    data = data.map(d=> {
                        d.checked = false;
                        return d;
                    });
                    func.setYAxisSelectData(data);
                    settings.chartDataSourceType = sourceType;
                });

                //listen chart brush button
                node.filter().xPath(".chart>.chart-panel>.chart-panel-head>button").delegate("", "click", function () {
                    let selectedYAxis = node.filter().xPath(".chart>.chart-panel>.chart-panel-body>.yAxis>.select").data("data");
                    let data;
                    switch (settings.chartDataSourceType) {
                        case "original":
                            data = settings.data.concat();
                            break;
                        case "filter":
                            data = settings.sortedData.concat();
                            break;
                        default:
                            let selectArr = func.getSelectRowArr();
                            if (selectArr.length == 0) {
                                alert("please check at least one box on the left");
                                node.filter().xPath(".chart>.chart-panel>.chart-panel-body>.dataSource>select").val(settings.chartDataSourceType);
                                return;
                            }
                            let idArr = selectArr.map(d=> {
                                d = d.children("td[name=id]").text();
                                return d;
                            });
                            data = idArr.map(d=> {
                                d = settings.data.find(d1=> {
                                    return d1.id == d;
                                });
                                return d;
                            });
                            break;
                    }
                    let xId = node.filter().xPath(".chart>.chart-panel>.chart-panel-body>.xAxis>select").val();
                    let xData = data.map(d=> {
                        d = d[xId];
                        return d;
                    });

                    let yDataArr = selectedYAxis.filter(d=> {
                        return d.checked;
                    }).map(d=> {
                        return d.id;
                    }).map(d=> {
                        let yData = data.map(d1=> {
                            d1 = d1[d];
                            return d1;
                        });
                        return yData;
                    });

                    if(yDataArr.length == 0){
                        return;
                    }

                    node.svg().html(()=> {
                        let svgW = node.svg().width();
                        //get max y of series
                        let maxValue = Math.max(...yDataArr.map(d=> {
                            d = d.map(d1=> {
                                d1 = Number.parseFloat(d1);
                                return d1;
                            });
                            return Math.max(...d);
                        }));
                        let yMax = maxValue;
                        if (maxValue > 1) {
                            let n = 0;
                            while ((yMax / 10) > 1) {
                                yMax = Math.floor(yMax / 10);
                                n++;
                            }
                            yMax = (yMax + 1) * Math.pow(10, n);
                        } else {
                            let n = 1;
                            while ((yMax * 10) < 1) {
                                yMax = yMax * 10;
                                n++;
                            }
                            yMax = (Math.floor(yMax*10)+1) * Math.pow(10, -n);
                        }
                        console.log(yMax);

                        //css setting
                        let svgWidthPercent = 0.8;
                        let svgHeight = 500;
                        let svgTopPadding = 50;
                        let svgBottomPadding = 50;
                        let svgLeftPadding = 80;
                        let svgRightPadding = 80;
                        let w = ((svgW * svgWidthPercent - svgLeftPadding - svgRightPadding) / (xData.length - 1) ).toFixed(2);

                        //draw xAxis
                        let xAxisHtml = "<path class='axis' d='";
                        xAxisHtml += xData.map((d, i)=> {
                            let x = (svgLeftPadding + i * w).toFixed(2);
                            let y = (svgHeight - svgBottomPadding);
                            d = "L" + x + " " + y;
                            return d;
                        }).join(" ").replace("L", "M");
                        xAxisHtml += "'/>";
                        xAxisHtml += "<g class='xText'>";
                        xAxisHtml += xData.map((d, i)=> {
                            let x = (svgLeftPadding + i * w).toFixed(2);
                            let y = (svgHeight - svgBottomPadding);
                            let line = "<path d='M" + x + " " + y + " L" + x + " " + (y + 10) + "'/>";
                            let text = "<text x='" + x + "' y='" + (y + 30) + "'>" + d + "</text>";
                            return line + text;
                        }).join("");
                        xAxisHtml += "</g>";

                        //draw yAxis
                        let yAxisHtml = "<path class='axis' d='";
                        yAxisHtml += "M" + svgLeftPadding + " " + svgTopPadding + " L" + svgLeftPadding + " " + (svgHeight - svgBottomPadding);
                        yAxisHtml += "'/>";
                        yAxisHtml += "<g class='yText'>";
                        let yArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                        yAxisHtml += yArr.map((d, i)=> {
                            let x = svgLeftPadding;
                            let y = svgTopPadding + i * (svgHeight - svgBottomPadding - svgTopPadding) / (yArr.length - 1);
                            let line = "<path d='M" + x + " " + y + " L" + (x - 10) + " " + y + "'/>";

                            return line;
                        }).join("");
                        yAxisHtml += "</g>";

                        let chartHtml = "<svg>" + xAxisHtml + yAxisHtml + "</svg>";

                        chartHtml += "<div class='symbol'>" + selectedYAxis.map(d=> {
                                let c1 = Math.random() * 255;
                                let c2 = Math.random() * 255;
                                let c3 = Math.random() * 255;
                                let c = "rgba(" + Math.floor(c1) + "," + Math.floor(c2) + "," + Math.floor(c3) + ",1)";
                                d = "<div class='row'><div class='line' style='background-color:" + c + "'></div>" + d.name + "</div>";
                                return d;
                            }).join("") + "</div>";
                        return chartHtml;
                    });
                });

                //listen chart refresh button

                //listen chart x axis change


                //listen page button
                node.right().xPath(".pagination>.button-info").delegate("", "click", function () {
                    if ($(this).children("i").hasClass("fa-angle-double-left")) {
                        settings.pageIndex = 0;
                        func.turnPage();
                    }
                    if ($(this).children("i").hasClass("fa-angle-left")) {
                        if (settings.pageIndex > 0) {
                            settings.pageIndex--;
                            func.turnPage();
                        }

                    }
                    if ($(this).children("i").hasClass("fa-angle-right")) {
                        if (settings.pageIndex < settings.sortedData.length / settings.displayRowNum - 1) {
                            settings.pageIndex++;
                            func.turnPage();
                        }
                    }
                    if ($(this).children("i").hasClass("fa-angle-double-right")) {
                        settings.pageIndex = Math.ceil(settings.sortedData.length / settings.displayRowNum - 1);
                        func.turnPage();
                    }

                })

                //listen page input
                node.right().xPath(".pagination>input").delegate("", "change", function () {
                    if (!Number.isNaN($(this).val())) {
                        let v = Number.parseInt($(this).val()) - 1;
                        let maxPageIndex = Math.floor(settings.data.length / settings.displayRowNum);
                        if (v < 0) {
                            settings.pageIndex = 0;
                        } else if (v > maxPageIndex) {
                            settings.pageIndex = maxPageIndex;
                        } else {
                            settings.pageIndex = v;
                        }
                        func.turnPage();
                    } else {
                        $(this).val(settings.pageIndex + 1);
                    }
                });

            });

            if (options == undefined) {
                return;
            }

            return element;
        }

    }
));
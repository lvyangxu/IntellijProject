/**
 * description 数据处理模型,包含json对象转换,utf8、base64的编码解码,md5编码,cookie读取及设置
 * author lvyangxu
 * 2015-08-11
 */


//自定义消息格式，封装为{"username":"","password":"","type":"","message":"base64Encode()"}格式的消息，主要用于websocket
function myMessageEncode(username,password,type,message){
    username = base64Encode(username);
    password = base64Encode(password);
    type = base64Encode(type);
    message = base64Encode(message);
    var result = "{\"username\":\""+username+"\",\"password\":\""+password+"\",\"type\":\""+type+"\",\"message\":\""+message+"\"}";
    return result;
}


///根据cookie名称获取cookie的值,参数为cookie名称
function getCookie(cookieName) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(cookieName + "=");
        if (c_start != -1) {
            c_start = c_start + cookieName.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            var result = unescape(document.cookie.substring(c_start, c_end));
            result = result.decode("base64");
            return result;
        }
    }
    return ""
}

///设置cookie的值及有效期,参数分别为cookie名称,cookie的值,cookie有效期(天)
function setCookie(cookieName, cookieValue, expiredays) {
    var exdate = new Date();
    cookieValue = cookieValue.encode("base64");
    exdate.setDate(exdate.getDate() + expiredays);
    var exdateStr = (expiredays == null) ? "" : ";expires=" + exdate.toGMTString();    
    document.cookie = cookieName + "=" + escape(cookieValue) + exdateStr+";path=/";
}

//获取本地日期
function getLocalDay(addDays) {
    var d = new Date();
    d.setDate(d.getDate() + addDays);
    var vYear = d.getFullYear();
    var vMon = d.getMonth() + 1;
    var vDay = d.getDate();
    var h = d.getHours();
    var m = d.getMinutes();
    var se = d.getSeconds();
    s = vYear + "-" + (vMon < 10 ? "0" + vMon : vMon) + "-" + (vDay < 10 ? "0" + vDay : vDay);
    return s;
}

//获取本地时间
function getLocalTime(addDays) {
    var d = new Date();
    d.setDate(d.getDate() + addDays);
    var vYear = d.getFullYear();
    var vMon = d.getMonth() + 1;
    var vDay = d.getDate();
    var h = d.getHours();
    var m = d.getMinutes();
    var se = d.getSeconds();
    s = vYear + "-" + (vMon < 10 ? "0" + vMon : vMon) + "-" + (vDay < 10 ? "0" + vDay : vDay) + " " + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m); //+ (se < 10 ? "0" + se : se);
    return s;
}

//构建0到max的随机整数
function buildRandom(max){
    var random = Math.round(Math.random()*max);
    return random;
}

//构建chartjs需要的lineChartData对象
function buildLineChartDatasets(xAxisArr, yAxisArrArr,displayNameArr) {
    var datasetArr = new Array();
    for (var i = 0; i < yAxisArrArr.length; i++) {
        var r = buildRandom(255);
        var g = buildRandom(255);
        var b = buildRandom(255);      
        var dataset =
                {
                    label: displayNameArr[i],
                    fillColor: "rgba("+r+","+g+","+b+",0.2)",
                    strokeColor: "rgba("+r+","+g+","+b+",1)",
                    pointColor: "rgba("+r+","+g+","+b+",1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba("+r+","+g+","+b+",1)",
                    data: yAxisArrArr[i]
                }
        datasetArr.push(dataset);
    }
    var lineChartData =
            {
                labels: xAxisArr,
                datasets: datasetArr
            };
    return lineChartData;
} 


function initLineChart(canvasId,lineChartData){
    var ctx = document.getElementById(canvasId).getContext("2d");
    var chart = new Chart(ctx);
    var myLine = chart.Line(lineChartData, {
        bezierCurve: true
    });    
    return myLine;
}

//判断一个数组是否包含另外一个数组的元素,返回相同长度的数组,元素为true,false
function arrIsContainArr(containerArr,keyArr){
    var result = new Array();
    for(var i=0;i<containerArr.length;i++){
        var isContain = false;
        for(var j=0;j<keyArr.length;j++){
            if(containerArr[i]==keyArr[j]){
                isContain = true;
                break;
            }            
        }
        result.push(isContain);
    }
    return result;
}

//判断是否需要重新登录
function checkLogin(data,loginUrl) {
    if(loginUrl==undefined){
        loginUrl = "../Account/Login";
    }

    if (data == "relogin") {
        window.location.href = loginUrl;
    }

}

//文件上传
function doFileUpload(id,url,successCallback,jsonData){
        var fd = new FormData();
        var fileNum = document.getElementById(id).files.length;
        if (fileNum == 0) {
            alert("请先选择至少一个文件");
            return;
        }
        for (var i = 0; i < fileNum; i++) {
            fd.append(i, document.getElementById(id).files[i]);
        }
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function (evt) {
            var jsonObject = stringToJsonObject(evt.target.responseText);
            if (jsonObject.success == "true") {
                successCallback(jsonObject.message);
            } else {
                alert("上传失败:"+jsonObject.message);
            }
        }, false);
        xhr.addEventListener("error", function () {
            alert("上传失败");
        }, false);
        if(jsonData!=undefined){
            for(var key in jsonData){
                fd.append(key,jsonData[key]);
            }           
        }
        
        xhr.open("POST", url);
        xhr.send(fd);
}

//获取某个月的天数
function getDaysOfMonth(d){
	var result = 0;
	var month = d.getMonth();
	month = month + 1;
	switch(month){
	case 1:
	case 3:
	case 5:	
	case 7:
	case 8:
	case 10:
	case 12:
		result = 31;
		break;
	case 2:
		//判断是否是闰年
        var year = d.getFullYear();
        if (((year % 4)==0) && ((year % 100)!=0) || ((year % 400)==0)){
        	result = 29
        }else{                    
        	result = 28;
        }		
		break;
	case 4:
	case 6:
	case 9:
	case 11:
		result = 30;
		break;
	}
	return result;
}
//转换到这周的星期一
function toMonday(dateStr){
	var arr = dateStr.split("-");
	var d = new Date(arr[0],parseInt(arr[1])-1,arr[2]);
	var dayOfWeek = d.getDay();
	if(dayOfWeek==0){
		dayOfWeek = 7;
	}
	var mondayNum = d.getDate()-dayOfWeek+1;
	d.setDate(mondayNum);
	var year = d.getFullYear();
	var month = parseInt(d.getMonth())+1;
	month = month<10?("0"+month):month;
	var day = d.getDate();
	day = day<10?("0"+day):day;
	return year + "-" + month + "-"+ day;
}

function toLastMonth(dateStr){
	var arr = dateStr.split("-");
	var y = parseInt(arr[0]);
	var m = parseInt(arr[1]);
	if(m==1){
		y = y - 1;
		return y + "-12";
	}else{
		return y+"-"+parseInt(m-1);
	}	
}

function getMonth(dateStr,addNum){
	var arr = dateStr.split("-");
	var y = parseInt(arr[0]);
	var m = parseInt(arr[1]);
	var yNum = parseInt(addNum/12);
	var mNum = addNum%12;
	
	if(mNum>=0){
		if(m+mNum<=12){
			y = y + yNum;
			m = m + mNum;		
		}else{
			y = y + yNum + 1;
			m = m + mNum - 12;
		}			
	}else{
		if(m+mNum>0){
		    y = y + yNum;
		    m = m + mNum;
		}else{
		    y = y + yNum - 1;
		    m = m + mNum + 12;			
		}
	}

	return y + "-" + (m<10?"0"+m:m);
}

//compare two datetime str
function later(dateStr1,dateStr2){
	var arr1 = dateStr1.split("-");
	var d1 = new Date(arr1[0],parseInt(arr1[1])-1,arr1[2]);	
	var arr2 = dateStr2.split("-");
	var d2 = new Date(arr2[0],parseInt(arr2[1])-1,arr2[2]);		
	if(d1.getTime()>=d2.getTime()){
		return dateStr1;
	}else{
		return dateStr2;
	}
	
}
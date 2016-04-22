/**
 * 
 */

//filter
Array.prototype.filter = function(callback){
	var result = new Array();
	for(var i=0;i<this.length;i++){
		var element = this[i];
		if(callback(element)){
			result.push(element);
		}		
	}
	return result;
}

//distinct
Array.prototype.distinct = function(callback){
	var result = new Array();
	var callbackResult = new Array();
	for(var i=0;i<this.length;i++){
		if(callbackResult.indexOf(callback(this[i]))==-1){
			result.push(this[i]);
			callbackResult.push(callback(this[i]));
		}		
	}
	return result;
}

//collect
Array.prototype.collect = function(type,arg){
	var result = "";
	switch(type){
	case "join":
		for(var i=0;i<this.length;i++){
			var element = this[i];			
			result += element;
			if(i!=this.length-1){
				result += arg;
			}
		}
		break;
	case "excel-join":
		for(var i=0;i<this.length;i++){
			var element = this[i];				
			for(var key in element){
				result += element[key] + "\t";
			}		
			result = result.substr(0,result.length-1);
			if(i!=this.length-1){
				result += "\n";
			}
		}		
		break;
	}
	return result;
}

//find two array equal element and callback with them
Array.prototype.relateCallback = function(arr,callback,map1,map2){
	for(var i=0;i<this.length;i++){
		var element = this[i];		
		var obj1 = element;
		if(map1!=undefined){
			obj1 = map1(element);
		}
		for(var j=0;j<arr.length;j++){
			var obj2 = arr[j];
			if(map2!=undefined){
				obj2 = map2(arr[j]);
			}			
		    if(obj1==obj2){
		    	var result = callback(element,arr[j]);
		    	if(result!=undefined){
			    	if(result==false){
			    		return;
			    	}		    		
		    	}
		    	

		    }	
		}		
	}
}
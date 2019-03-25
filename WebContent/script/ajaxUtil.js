
/**
 * ajax 发送 Get 请求
 * @param url 路径
 * @param data json格式的参数
 * @param fun 回调方法名称
 */
function ajaxFunGet(url,data,fun){
    $.ajax({
        type : 'get',
        dataType : 'json',
        url : url,
        data : data,
        success : function(data) {
            return ajaxCallBack(fun, data);
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.error(textStatus);
            console.error(XMLHttpRequest.status);
            console.error(XMLHttpRequest.readyState);
            alert("请求失败", 3);
            return false;
        }
    });
}

/**
 * 异步方式执行ajax请求
 * @param url
 * @param data
 * @param funName
 * @returns
 */
function ajaxFun(url,data,funName){
	$.ajax({
		type:'post',
		dataType:'json',
		url:url,
		data:data,
		success:function(data){
			return ajaxCallBack(funName,data) ;
		},
		 error:function(XMLHttpRequest, textStatus, errorThrown){
        	console.error(textStatus);
        	console.error(XMLHttpRequest.status);
        	console.error(XMLHttpRequest.readyState);
        	return false ;
	    }
	});
}

/**
 * 同步方式执行ajax请求
 * @param url
 * @param data
 * @param funName
 * @returns
 */
function ajaxFunSync(url,data,funName){
	$.ajax({
		type:'post',
		dataType:'json',
		url:url,
		cache:false,  
	    async:false,
		data:data,
		success:function(data){
			ajaxCallBack(funName,data) ;
		},
		 error:function(XMLHttpRequest, textStatus, errorThrown){
        	console.error(textStatus);
        	console.error(XMLHttpRequest.status);
        	console.error(XMLHttpRequest.readyState);
	    }
	});
}

/**
 * 执行ajax回调函数
 * @param funName
 * @param data
 * @returns
 */
function ajaxCallBack(funName,data){
    funName(data) ;
}

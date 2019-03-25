/**
 * 登录操作js
 * @returns
 */
$(document).ready(function () {

    //初始化验证码
    initSlideImageCode();

    // 获取页面元素
    var selectors = {
        errorMsg: $("#errorMsg"),
        allInput: $("input")
    };

    // 默认隐藏错误信息的提示
    selectors.errorMsg.hide();

    // 绑定回车事件：回车执行登录操作
    $("#username").focus(); //初始化获取焦点事件
    document.onkeydown = function (e) { //回车相当于点击登录
        var ev = document.all ? window.event : e;
        if (ev.keyCode == 13) {
            $('#loginBtn').click();
        }
    };

    // 失去焦点时的校验
    selectors.allInput.blur(function () {
        // 获取表单数据
        var username = $('#username').val();
        var password = $('#password').val();
        var pageCode = $('#pageCode').val();

        // 验证当前失去焦点的标签内容是否合法
        if ($(this).attr("id") == "username") {
            if (username == "" || username == null) {
                $("#errorMsg").show();
                $("#errorMsg").text("帐号不能为空！");
                return false;
            }
        } else if ($(this).attr("id") == "password") {
            if (password == "" || password == null) {
                selectors.errorMsg.show();
                $("#errorMsg").text("密码不能为空！");
                return false;
            }
        }else if ($(this).attr("id") == "pageCode") {
            if (pageCode == "" || pageCode == null) {
                selectors.errorMsg.show();
                $("#errorMsg").text("验证码不能为空！");
                return false;
            }
        }
    });

    // 获取焦点时的处理：隐藏当前输入框的错误信息提示，隐藏提交数据响应结果的错误提示
    selectors.allInput.focus(function () {
        if ($(this).attr("id") == "username") {
           $("#errorMsg").text("帐号不能为空！");
        } else if ($(this).attr("id") == "password") {
            $("#errorMsg").text("密码不能为空！");
        } else if ($(this).attr("id") == "pageCode") {
            $("#errorMsg").text("验证码不能为空！");
        }
        selectors.errorMsg.hide();
    });

    // 绑定登录事件
    $('#loginBtn').click(function () {
        // 获取表单数据
        var username = $('#username').val();
        var password = $('#password').val();
        var pageCode = $('#pageCode').val();

        // 验证表单数据是否为空，为空则显示响应的错误信息
        if (username == "" || username == null) {
            selectors.errorMsg.show();
            $("#errorMsg").text("帐号不能为空！");
            return false;
        } else if (password == "" || password == null) {
            selectors.errorMsg.show();
            $("#errorMsg").text("密码不能为空！");
            return false;
        }else if (pageCode == "" || pageCode == null) {
            selectors.errorMsg.show();
            $("#errorMsg").text("验证码错误！");
            return false;
        }

        // 构建请求数据
        var url = CPATH + '/index/login';
        
    });

});

/**
 * 初始化滑块验证码
 */
function initSlideImageCode() {
    var url = CPATH+"index/initSlideVerifyImage?time="+new Date().getTime();
    ajaxFunSync(url, null, showSlideImage);
}

/**
 * 图片验证码初始化响应结果
 * @param result
 */
function showSlideImage(result) {
    if(result.success){
        //响应内容
        var data = result.result;
        
        //初始化滑块验证码div
        $("#imgscode").imgcode({
        	//抠图
            frontimg:data.newImage,
            
            //拖动滑块
            backimg:data.oriCopyImage,
            
            //拖动滑块初始的y坐标
            pointY:data.pointY,
            
            //验证码刷新回调函数
            refreshcallback:function(){
                //刷新验证码
                initSlideImageCode();
            },
            
            //拖动完成后的回调函数
            callback:function(msg){
                //向后台请求校验滑动验证码
                var url = CPATH +"index/checkValidateCode?pointX="+msg.xpos;
                ajaxFunSync(url, null, showSlideCheckResult);
            }
        });
    }else{
        console.log(result.notice);
        initSlideImageCode();
    }
}

/**
 * 验证码校验结果显示
 * @param result
 */
function showSlideCheckResult(result) {
    if(result.success){
        console.log("OK");
        //记录新的验证码，并则禁用鼠标事件
        $("#pageCode").val(result.result);
        $(".code-btn-img").unbind('mousedown');
        $(".code-btn-img").unbind('mouseup');
        $(".code-btn-img").css("cursor","none");

        //如果错误信息是验证码错误，则清除
        if($("#errorMsg").text()=='验证码错误！'){
            $("#errorMsg").text('');
            $("#errorMsg").hide();
        }
    }else {//刷新验证码
        $("#errorMsg").show();
        $("#errorMsg").text(result.notice);
        $("#pageCode").val('');
        initSlideImageCode();
    }
}

/**
 * 登录请求后的回调函数
 * @param data
 */
function afterSubmit(data) {
    // 校验数据响应结果，成功，则直接跳转到主页面
    if (data.success) {
        window.location.href=PATH+"/index.jsp";
    } else {
        // 登录失败，刷新验证码
        initSlideImageCode();

        // 显示错误提示信息：验证码错误和登录错误，显示错误信息的位置不同
        var errorMsg = data.notice;
        $("#errorMsg").text(errorMsg);
        $("#errorMsg").show();
    }
    
}
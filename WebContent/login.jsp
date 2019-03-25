<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String contextPath = request.getContextPath();
%>
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>登陆</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1" name="viewport"/>
    <link href="<%=contextPath %>/style/login.css" rel="stylesheet" type="text/css">
    <link href="<%=contextPath %>/style/slide.css" rel="stylesheet" type="text/css">
</head>
<body>
<div class="login_content">
    <div class="login_cont_sys">
        <div class="login_sys_title">
            <h1>滑块验证码登录页面demo</h1>
        </div>
        <div class="login_case">
            <ul style="padding-left:20px;">
                <li>
                    <input id="username" name="username" style="background-color:#fff;border-color:transparent;width: 280px;" class="input-account" placeholder="帐号"/>
                </li>
                <li>
                    <input id="password" name="password" class="input-password" placeholder="密码" type="password" style="background-color:#fff;border-color:transparent;width: 280px;"
                           onpaste="return false" oncontextmenu="return false" oncopy="return false" oncut="return false" autocomplete="off"/>
                </li>
                <li>
                	<input id="pageCode" name="pageCode" type="hidden"/>
                </li>
                
                <!--滑动验证码-->
                <li style="height: 220px;">
                    <div id="imgscode"></div>
                </li>
            </ul>
            <ul style="position: absolute;left: 0;right:40px;">
                <li>
                    <span id="errorMsg" style="color:red;display: none;"></span>
                    <button id="loginBtn" style="margin-top:10px" class="login-btn" value="登 录">登录</button>
                </li>
            </ul>
        </div>

        <div id="msg"></div>
    </div>
</div>
<!-- 设置全局变量 -->
<script type="text/javascript">
    var PATH = "<%=contextPath%>";
    var CPATH = PATH + "/controller/";
</script>
<script src="<%=contextPath %>/script/jquery-1.11.2.min.js" type="text/javascript"></script>
<script src="<%=contextPath %>/script/ajaxUtil.js" type="text/javascript"></script>
<script src="<%=contextPath %>/script/jquery.lgyslide.js" type="text/javascript"></script>
<script src="<%=contextPath %>/script/login.js" type="text/javascript"></script>
</body>

</html>

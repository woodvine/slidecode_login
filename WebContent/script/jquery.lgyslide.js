/**
 * Created by lgy on 2017/10/21.
 * 图片验证码前端插件：提供一个初始方法imgcode，完成对滑块验证码前端的渲染。
 * 依赖四项配置：
 * 1、大拼图的图片路径
 * 2、拼图滑块的图片路径
 * 3、鼠标拖拽完成后的回调函数
 * 4、验证码刷新事件函数
 */
(function ($) {
	/**
	 * 初始化函数：需要外界传递一个配置项
	 */
    $.fn.imgcode = function (options) {
        //默认初始化参数定义
        var defaults = {
            frontimg:"",  //大拼图
            backimg:"",   //拼图滑块
            callback:"",  //鼠标拖拽完成后的回调函数
            refreshcallback:"" //验证码刷新事件函数
        };
        
        //jquery语法：合并 defaults 和 options, 不修改 defaults。
        var opts = $.extend(defaults, options);
        
        /**
         * 根据配置信息初始化滑块验证码页面
         * 1、base64图片形式显示滑块
         * 2、base64图片形式显示背景图片
         * 3、滑块的top属性是后台生成的抠图的y坐标
         * 4、滑块拖动的最后的位置，需要跟后台抠图的x坐标进行比对，在允许误差范围内则说明拖动行为OK
         * 5、页面添加refreshIcon刷新按钮，更新滑块验证码
         */
        return this.each(function () {
        	//获取当前对象
            var $this = $(this);
            
            //拼接验证码内容
            var html = '<div class="code-k-div">' +
                '<div class="code-con">' +
                '<div class="code-img">' +
                '<div class="code-img-con">' +
                '<div class="code-mask" style="top:'+options.pointY+'px;"><img class="code-front-img" src="data:image/gif;base64,'+opts.frontimg+'"></div>' +
                '<img class="code-back-img" src="data:image/gif;base64,'+opts.backimg+'"></div>' +
                '<div class="refreshIcon"></div>' +
                '</div>' +
                '<div class="code-btn">' +
                '<div class="code-btn-img code-btn-m"></div>' +
                '<span class="code-span">按住鼠标左键，拖动完成上方拼图</span>' +
                '</div></div></div>';
            
            //填充验证码元素区域
            $this.html(html);

            //定义拖动参数
            var $divMove = $(this).find(".code-btn-img"); //拖动按钮
            var $divWrap = $(this).find(".code-btn");//鼠标可拖拽区域
            var mX = 0, mY = 0;//定义鼠标X轴Y轴
            var dX = 0, dY = 0;//定义滑动区域左、上位置
            var isDown = false;//mousedown标记
            
            //ie的事件监听，拖拽div时禁止选中内容，firefox与chrome已在css中设置过-moz-user-select: none; -webkit-user-select: none;
            if(document.attachEvent) {
                $divMove[0].attachEvent('onselectstart', function() {
                    return false;
                });
            }

            //按钮拖动事件
            $divMove.unbind('mousedown').on({
                mousedown: function (e) {
                    //清除提示信息
                    $this.find(".code-tip").html("");
                    
                    //获取鼠标当前位置
                    var event = e || window.event;
                    mX = event.pageX;
                    dX = $divWrap.offset().left;
                    dY = $divWrap.offset().top;
                    
                    //鼠标拖拽启
                    isDown = true;
                    
                    //添加活动样式
                    $(this).addClass("active");
                    
                    //修改按钮阴影
                    $divMove.css({"box-shadow":"0 0 8px #666"});
                }
            });
            
            //刷新验证码事件：调用外界回调函数
            $this.find(".refreshIcon").unbind('click').click(function(){
                opts.refreshcallback();
            });

            //鼠标点击松手事件
            $divMove.unbind('mouseup').mouseup(function (e) {
            	//查找滑块对象
                var lastX = $this.find(".code-mask").offset().left - dX - 1;
                
                //鼠标拖拽启
                isDown = false;
                
                //移除活动样式
                $divMove.removeClass("active");
                
                //还原按钮阴影
                $divMove.css({"box-shadow":"0 0 3px #ccc"});
                
                //返回当前鼠标拖动到的目标位置，并调用回调函数完成验证
                opts.callback({xpos:lastX});
            });

            //滑动事件
            $divWrap.mousemove(function (event) {
                var event = event || window.event;
                var x = event.pageX;//鼠标滑动时的X轴
                if (isDown) {
                    if(x>(dX+30) && x<dX+$(this).width()-20){
                        $divMove.css({"left": (x - dX - 20) + "px"});//div动态位置赋值
                        $this.find(".code-mask").css({"left": (x - dX-30) + "px"});
                    }
                }
            });
        })
    }
})(jQuery);

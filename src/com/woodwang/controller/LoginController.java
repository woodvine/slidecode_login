package com.woodwang.controller;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.woodwang.bean.ResultData;
import com.woodwang.bean.SlideVerifyToolkit;

/**
 * Controller
 * @author admin
 *
 */
@RequestMapping("/index")
@Controller
public class LoginController {
	private static Logger logger = Logger.getLogger(LoginController.class);
	
	/**
     * 验证码校验失败IP统计
     */
    private Map<String,JSONObject> codeErrorInfoMap = new HashMap<String,JSONObject>();
    
    /**
     * 验证码允许误差
     */
    private double errLimit = 5;

    /**
     * 同一个IP一段时间内请求失败的最大次数
     */
    private int maxErrorCount = 20;

    /**
     * 同一个IP一段时间限制为10分钟
     */
    private long maxErrorTimespan = 10*60*1000;

    /**
     * 验证码校验成功后返回前端一个随机数据，并存在在会话中，作为验证操作成对出现的依据
     */
    private String CHECK_OK = "slideCheckResult";
    
    /**
     * 登出系统
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/initSlideVerifyImage")
    @ResponseBody
    public ResultData initSlideVerifyImage(HttpServletRequest request, HttpServletResponse response) {
        ResultData result = new ResultData ();
        Map<String,String> slideVerifyInfo = null;
        SlideVerifyToolkit toolkit = new SlideVerifyToolkit();

        try {
            //获取静态图片资源
            File templateFile = getSlideFile("templates","-w.png");
            File targetFile = getSlideFile("targets",".jpg");

            //对图片进行抠图，生成滑动验证信息
            slideVerifyInfo = toolkit.pictureTemplatesCut(templateFile,targetFile,"png", "jpg");

            //缓存滑块验证的信息：如果是前台正常请求，则request非空；如果是后台验证失败后自动刷新，则无该信息
            String pointX = slideVerifyInfo.get("pointX");
            if(request!=null) {
            	request.getSession().setAttribute(com.google.code.kaptcha.Constants.KAPTCHA_SESSION_KEY,pointX);
            }

            slideVerifyInfo.remove("pointX");//X的坐标是后台校验使用的，需要移除
            slideVerifyInfo.remove("xPercent");//xPercent是后台校验使用的，需要移除
            slideVerifyInfo.remove("yPercent");//xPercent是后台校验使用的，需要移除
            
            result.setResult(slideVerifyInfo);
            result.setSuccess(true);
        } catch (Exception e) {
            logger.error("初始化滑块验证码异常。",e);
            result.setNotice("初始化滑块验证码异常!");
        }

        return result;
    }

    /**
     * 检查验证码
     * @param request 用于获取生产的验证码
     * @return
     */
    @RequestMapping(value = "/checkValidateCode")
    @ResponseBody
    public ResultData checkValidateCode(HttpServletRequest request) {
        ResultData result = new ResultData ();
        String ip = request.getRemoteAddr();
        
        //校验IP是否是有攻击倾向
        if(!isAllowCheck(ip)) {
        	result.setNotice("受限IP，拒绝服务！");
        	return result;
        }
        
        // 传入的验证码判空处理
        String pageCode = request.getParameter("pointX");

        // 获取验证码
        String kcode = (String) request.getSession().getAttribute(
                com.google.code.kaptcha.Constants.KAPTCHA_SESSION_KEY);

        if(kcode==null ||StringUtils.isBlank(pageCode)){
            logger.error("Something is wrong that there is no slide image code info.");
            result.setNotice("验证码错误！");
        }else{
            //session里的校验码取用后将其置空，让其只生效一次
            Random random = new Random();
            String checkOk = String.valueOf(random.nextInt(100000));
            request.getSession().setAttribute(com.google.code.kaptcha.Constants.KAPTCHA_SESSION_KEY, "");
            request.getSession().setAttribute(CHECK_OK,checkOk );
            String pointX = kcode;
            double imagePointX = Double.parseDouble(pointX);
            double maxRange = imagePointX + errLimit;
            double minRange = imagePointX - errLimit;
            double realPointX = Double.parseDouble(pageCode);
            if(realPointX>minRange && realPointX<maxRange){
                logger.debug("滑块在范围内，验证OK");
                result.setSuccess(true);
                result.setResult(checkOk);
                
                //清理受限IP
                codeErrorInfoMap.containsKey(ip);
            }else {
                // 设置结果
                result.setNotice("验证码错误！");
            }
        }

        //统计失败信息，一旦失败，后台自动刷新验证码
        if(!result.isSuccess()){
        	
        	//统计失败次数
            putCheckErrorLog(ip);
            
            //自动生成新的验证码，防止暴力破解攻击
            logger.info("防止暴力破解重新生成验证码");
            initSlideVerifyImage(null,null);
            
        }
        return result;
    }
    
    /**
     * 从静态资源中获取滑块验证码图片资源
     * @param fileType
     * @param suffix    图片后缀jpg和png两种
     * @return
     */
    private File getSlideFile(String fileType,String suffix){
        String filePath = null;
        Random random = new Random();
        int picNo = random.nextInt(4) + 1;
        if(fileType.equals("templates")){//抠图模板六张
            filePath = "static/templates/";
            picNo = random.nextInt(6) + 1;
        }else{//原始图片多一些
            filePath = "static/targets/";
            picNo = random.nextInt(23) + 1;
        }

        StringBuffer fileNameBuffer = new StringBuffer();
        fileNameBuffer.append(filePath);
        fileNameBuffer.append(picNo);
        fileNameBuffer.append(suffix);

        InputStream stream = getClass().getClassLoader().getResourceAsStream(fileNameBuffer.toString());
        File templateFile = new File(picNo + suffix);
        try {
            FileUtils.copyInputStreamToFile(stream, templateFile);
        } catch (IOException e) {
            logger.error("文件处理异常",e);
        }

        return templateFile;
    }

    /**
     * 校验某个ip是否可以继续执行校验请求
     * @return
     */
    private boolean isAllowCheck(String ip) {
    	JSONObject info = codeErrorInfoMap.get(ip);
    	
    	//首次发起校验请求，允许
        if(info==null){
        	return true;
        }
        
        //非首次：判断失败次数
        Integer failTimes = info.getInteger("failTimes");
        if(failTimes==null || failTimes<maxErrorCount) {
        	return true;
        }
        
        //判断时间
        
        return false;
    }
    
    /**
     * 记录操作失败配置
     * @param ip
     */
    private synchronized void  putCheckErrorLog(String ip){
        JSONObject info = codeErrorInfoMap.get(ip);
        if(info==null){
            info = new JSONObject();
            codeErrorInfoMap.put(ip,info);
        }

        //更新上次失败时间
        info.put("lastFailTime", System.currentTimeMillis());
        
        //累加失败次数
        Integer failTimes = info.getInteger("failTimes");
		info.put("failTimes", failTimes==null?1:(failTimes+1));
    }
	
	/**
	 * check if the target is exists
	 * @param user
	 * @return
	 */
	@RequestMapping("/login")
	@ResponseBody
	public ResultData login(HttpServletRequest request) {
		ResultData result = new ResultData();
		String userId = request.getParameter("userId");
		
		return result;
	}
	
	/**
	 * check if the target is exists
	 * @param user
	 * @return
	 */
	@RequestMapping("/logout")
	@ResponseBody
	public ResultData logout(HttpServletRequest request) {
		ResultData result = new ResultData();
		String userId = request.getParameter("userId");
		
		return result;
	}
	
}

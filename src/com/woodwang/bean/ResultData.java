package com.woodwang.bean;


import java.io.Serializable;
import java.util.List;

/**
 * Controller Common Data 
 * @author admin
 *
 */
public class ResultData implements Serializable {
	 /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
     * 操作成功标示位 true:成功 false:失败
     */
    private boolean success = false;
    
    /**
     * 页面提示信息
     */
    private String notice ; 
    
    /**
     * 返回单个值
     */
    private String  noticeId; 
    
    /**
     * 查询结果集
     */
    private List<Object> results;
    
    /**
     * 查询结果：单个对象，如果是分页查询也可以返回Pagination对象
     */
    private Object result;

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getNotice() {
		return notice;
	}

	public void setNotice(String notice) {
		this.notice = notice;
	}

	public String getNoticeId() {
		return noticeId;
	}

	public void setNoticeId(String noticeId) {
		this.noticeId = noticeId;
	}

	public List<Object> getResults() {
		return results;
	}

	public void setResults(List<Object> results) {
		this.results = results;
	}

	public Object getResult() {
		return result;
	}

	public void setResult(Object result) {
		this.result = result;
	}
    
    
}

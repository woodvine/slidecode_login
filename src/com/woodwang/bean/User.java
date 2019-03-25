package com.woodwang.bean;

import org.sketch.orm.annotation.Collection;
import org.sketch.orm.annotation.PrimaryKey;
import org.sketch.orm.annotation.Space;

/**
 * 定义集合对应的java 实体类，指定与SequoiaDB数据库对应的映射信息
 * @Space		指定实体对应的集合空间名称
 * @Collection	指定实体对应的集合名称
 * @PrimaryKey  主键_id:必须是_id，且定义为String类型，否则SequoiaDB会自动创建Object类型的_id主键
 * @author admin
 *
 */
@Space(value = "sequoiadb")
@Collection(value = "Tb_E_User")
@PrimaryKey(value = "_id")
public class User {
	
	private String _id;
	
	private String userId;
	
	private String userName;

	private String password;

	private String roleId;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRoleId() {
		return roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	public String get_id() {
		return _id;
	}

	public void set_id(String _id) {
		this._id = _id;
	}
}

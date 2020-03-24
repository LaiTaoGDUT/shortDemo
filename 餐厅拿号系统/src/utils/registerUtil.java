package utils;

import java.sql.Connection;
import java.sql.Statement;

public class registerUtil {
	
	private String userId;
	private String userName;
	private String userPassword;
	
	public registerUtil(String userId, String userName, String userPassword) {
		this.userId = userId;
		this.userName = userName;
		this.userPassword = userPassword;
	}
	/**
	 * 用户账号和用户名查重
	 * @throws Exception 
	 */
	public void userIdCheckRepeat() throws Exception {
		DbUtil dbUtil = new DbUtil(); 
		Connection con = dbUtil.getCon();     //获取数据连接
		Statement stmt = con.createStatement();    //获取Statement
	}
	
	
}


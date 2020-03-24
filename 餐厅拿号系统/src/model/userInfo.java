package model;

import java.io.Serializable;

public class userInfo implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private String userId;
	private String userName;
	private String userPassword;
	private boolean whetherHaveNumber;
	
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
	public String getUserPassword() {
		return userPassword;
	}
	public void setUserPassword(String userPassword) {
		this.userPassword = userPassword;
	}
	public boolean getWhetherHaveNumber() {
		return whetherHaveNumber;
	}
	public void setWhetherHaveNumber(boolean whetherHaveNumber) {
		this.whetherHaveNumber = whetherHaveNumber;
	}
	public String toString() {
		return "userInfo [userId=" + userId + ", userName=" + userName + ", userPassword=" + userPassword + "]"; 
	}
	
}

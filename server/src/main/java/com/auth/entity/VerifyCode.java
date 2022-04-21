package com.auth.entity;



public class VerifyCode {

	private int id;
	private String verifyPhone;
	private String verifyCode;
	private Integer state;
	private String createDate;
	private String updateDate;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getVerifyPhone() {
		return verifyPhone;
	}

	public void setVerifyPhone(String verifyPhone) {
		this.verifyPhone = verifyPhone;
	}

	public String getVerifyCode() {
		return verifyCode;
	}

	public void setVerifyCode(String verifyCode) {
		this.verifyCode = verifyCode;
	}

	public Integer getState() {
		return state;
	}

	public void setState(Integer state) {
		this.state = state;
	}

	public String getCreateDate() {
		return createDate;
	}

	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}

	public String getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(String updateDate) {
		this.updateDate = updateDate;
	}
}

package com.ccms.system.dto;

public class LoginResponseDTO {
	
	String jwt;
	Long userID;
	public LoginResponseDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public LoginResponseDTO(String jwt, Long userID) {
		super();
		this.jwt = jwt;
		this.userID = userID;
	}
	public String getJwt() {
		return jwt;
	}
	public void setJwt(String jwt) {
		this.jwt = jwt;
	}
	public Long getUserID() {
		return userID;
	}
	public void setUserID(Long userID) {
		this.userID = userID;
	}
	
}

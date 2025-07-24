package com.ccms.system.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="user")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="u_id")
	private int uid;
	
	private String uname;
	
	@Column(unique = true)
	private String email;
	
	private String phoneno;
	
	@JoinColumn(name="r_id")
	@ManyToOne
	private Role role;	
	
	private String password;
	
	@Column(name="d_name")
	private String dname;

	public User() {
		super();
		// TODO Auto-generated constructor stub
	}

	public User(int uid, String uname, String email, String phoneno, Role role, String password, String dname) {
		super();
		this.uid = uid;
		this.uname = uname;
		this.email = email;
		this.phoneno = phoneno;
		this.role = role;
		this.password = password;
		this.dname = dname;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	public String getUname() {
		return uname;
	}

	public void setUname(String uname) {
		this.uname = uname;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneno() {
		return phoneno;
	}

	public void setPhoneno(String phoneno) {
		this.phoneno = phoneno;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getDname() {
		return dname;
	}

	public void setDname(String dname) {
		this.dname = dname;
	}

	@Override
	public String toString() {
		return "User [uid=" + uid + ", uname=" + uname + ", email=" + email + ", phoneno=" + phoneno + ", role=" + role
				+ ", password=" + password + ", dname=" + dname + "]";
	}

	
	
	
	
	

}

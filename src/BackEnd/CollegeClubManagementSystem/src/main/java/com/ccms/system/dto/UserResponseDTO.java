package com.ccms.system.dto;

import com.ccms.system.entities.Role;

public class UserResponseDTO {
	 private int uid;
	    private String uname;
	    private String email;
	    private String phoneno;
	    private Role role;
	    private String dname;
		public UserResponseDTO() {
			super();
			// TODO Auto-generated constructor stub
		}
		public UserResponseDTO(int uid, String uname, String email, String phoneno, Role role, String dname) {
			super();
			this.uid = uid;
			this.uname = uname;
			this.email = email;
			this.phoneno = phoneno;
			this.role = role;
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
		public String getDname() {
			return dname;
		}
		public void setDname(String dname) {
			this.dname = dname;
		}
		@Override
		public String toString() {
			return "UserResponseDTO [uid=" + uid + ", uname=" + uname + ", email=" + email + ", phoneno=" + phoneno
					+ ", role=" + role + ", dname=" + dname + "]";
		}
	    
	    
}

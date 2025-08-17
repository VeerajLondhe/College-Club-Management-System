package com.ccms.system.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="role")
public class Role {
	@Id
	@Column(name="r_id")
	private int rid;
	
	@Column(name="r_name")
	private String rname;

	public Role() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Role(int rid, String rname) {
		super();
		this.rid = rid;
		this.rname = rname;
	}

	public int getRid() {
		return rid;
	}

	public void setRid(int rid) {
		this.rid = rid;
	}

	public String getRname() {
		return rname;
	}

	public void setRname(String rname) {
		this.rname = rname;
	}

	@Override
	public String toString() {
		return "Role [rid=" + rid + ", rname=" + rname + "]";
	}
	
	
	
	

}

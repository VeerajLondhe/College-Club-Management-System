package com.example.demo.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="club_member")
public class ClubMember {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "cm_id")
	int cmID;
	
	@ManyToOne
    @JoinColumn(name = "u_id", nullable = false)
    User uId;
	
	@ManyToOne
    @JoinColumn(name = "c_id", nullable = false)
    Club club;
	
	@Column(name = "position")
	String position;
	
	@Column(name = "req_status")
	boolean req_status;

	public ClubMember() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ClubMember(int cmID, User uId, Club cId, String position, boolean req_status) {
		super();
		this.cmID = cmID;
		this.uId = uId;
		this.club = cId;
		this.position = position;
		this.req_status = req_status;
	}

	public int getCmID() {
		return cmID;
	}

	public void setCmID(int cmID) {
		this.cmID = cmID;
	}

	public User getuId() {
		return uId;
	}

	public void setuId(User uId) {
		this.uId = uId;
	}

	public Club getcId() {
		return club;
	}

	public void setcId(Club cId) {
		this.club = cId;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public boolean isReq_status() {
		return req_status;
	}

	public void setReq_status(boolean req_status) {
		this.req_status = req_status;
	}

	@Override
	public String toString() {
		return "ClubMember [cmID=" + cmID + ", uId=" + uId + ", cId=" + club + ", position=" + position + ", req_status="
				+ req_status + "]";
	}
	
	
	
	

}

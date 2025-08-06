package com.ccms.system.entities;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="club_member")
public class ClubMember {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="cm_id")
	private int clubMemberId;
	
	@JoinColumn(name="u_id")
	@Column(name="u_id")
	private int userID;
	
	@JoinColumn(name="c_id")
	@Column(name="c_id")
	private int  clubId;
	
	@Column(name="position")
	private String position;
	
	@Column(name="req_status")
	private boolean reqStatus;

	public ClubMember() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ClubMember(int clubMemberId, int userID, int clubId, String position, boolean reqStatus) {
		super();
		this.clubMemberId = clubMemberId;
		this.userID = userID;
		this.clubId = clubId;
		this.position = position;
		this.reqStatus = reqStatus;
	}

	public int getClubMemberId() {
		return clubMemberId;
	}

	public void setClubMemberId(int clubMemberId) {
		this.clubMemberId = clubMemberId;
	}

	public int getUserID() {
		return userID;
	}

	public void setUserID(int userID) {
		this.userID = userID;
	}

	public int getClubId() {
		return clubId;
	}

	public void setClubId(int clubId) {
		this.clubId = clubId;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public boolean isReqStatus() {
		return reqStatus;
	}

	public void setReqStatus(boolean reqStatus) {
		this.reqStatus = reqStatus;
	}

	@Override
	public String toString() {
		return "ClubMember [clubMemberId=" + clubMemberId + ", userID=" + userID + ", clubId=" + clubId + ", position="
				+ position + ", reqStatus=" + reqStatus + "]";
	}
	
	
	
}
package com.ccms.system.entities;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name="club")
public class Club {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="c_id")
	private int  clubId;
	
	private String clubname;
	
	private String description;
	
	private Date creationdate;
	
	private boolean status;
	
	@JoinColumn(name="u_id")
	@Column(name="u_id")
	private int userId;

	public Club() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Club(int clubId, String clubname, String description, Date creationdate, boolean status, int userId) {
		super();
		this.clubId = clubId;
		this.clubname = clubname;
		this.description = description;
		this.creationdate = creationdate;
		this.status = status;
		this.userId = userId;
	}

	public int getClubId() {
		return clubId;
	}

	public void setClubId(int clubId) {
		this.clubId = clubId;
	}

	public String getClubname() {
		return clubname;
	}

	public void setClubname(String clubname) {
		this.clubname = clubname;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getCreationdate() {
		return creationdate;
	}

	public void setCreationdate(Date creationdate) {
		this.creationdate = creationdate;
	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	@Override
	public String toString() {
		return "Club [clubId=" + clubId + ", clubname=" + clubname + ", description=" + description + ", creationdate="
				+ creationdate + ", status=" + status + ", userId=" + userId + "]";
	}
	
	

}

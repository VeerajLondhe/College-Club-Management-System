package com.example.demo.entities;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "club")
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "c_id")
    private int cid;

    @Column(name = "clubname")
    private String cname;

    private String description;
    private Date creationdate;

    private boolean status;
    
    @JoinColumn(name="u_id")
	@Column(name="u_id")
	private int userId;
    
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Events> events;

	public Club() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Club(int cid, String cname, String description, Date creationdate, boolean status, int userId,
			List<Events> events) {
		super();
		this.cid = cid;
		this.cname = cname;
		this.description = description;
		this.creationdate = creationdate;
		this.status = status;
		this.userId = userId;
		this.events = events;
	}

	public int getCid() {
		return cid;
	}

	public void setCid(int cid) {
		this.cid = cid;
	}

	public String getCname() {
		return cname;
	}

	public void setCname(String cname) {
		this.cname = cname;
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

	public List<Events> getEvents() {
		return events;
	}

	public void setEvents(List<Events> events) {
		this.events = events;
	}

	@Override
	public String toString() {
		return "Club [cid=" + cid + ", cname=" + cname + ", description=" + description + ", creationdate="
				+ creationdate + ", status=" + status + ", userId=" + userId + ", events=" + events + "]";
	}

    // Default constructor
    
}

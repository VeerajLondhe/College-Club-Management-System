package com.example.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "club")
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "c_id")
    private int cid;

    @Column(name = "clubname", nullable = false)
    private String cname;

    @Column(nullable = false)
    private String description;

    @Column(name = "creationdate", nullable = false)
    private java.sql.Date date;

    @Column(nullable = false)
    private boolean status = false;

    @ManyToOne
    @JoinColumn(name = "u_id", nullable = false)
    @JsonIgnoreProperties({"clubs", "password", "role"})
    private User user;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Events> events;

    public Club() {}

    public Club(int cid, String cname, String description, java.sql.Date date, boolean status, User user, List<Events> events) {
        this.cid = cid;
        this.cname = cname;
        this.description = description;
        this.date = date;
        this.status = status;
        this.user = user;
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

    public java.sql.Date getDate() {
        return date;
    }

    public void setDate(java.sql.Date date) {
        this.date = date;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Events> getEvents() {
        return events;
    }

    public void setEvents(List<Events> events) {
        this.events = events;
    }

    @Override
    public String toString() {
        return "Club [cid=" + cid + ", cname=" + cname + ", description=" + description +
                ", date=" + date + ", status=" + status +
                ", user=" + (user != null ? user.getUid() : null) +
                ", eventsCount=" + (events != null ? events.size() : 0) + "]";
    }
}
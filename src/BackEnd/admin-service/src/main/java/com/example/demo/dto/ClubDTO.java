package com.example.demo.dto;

import java.util.Date;

public class ClubDTO {
    private int id;
    private String name;
    private String description;
    private String category;
    private String president;
    private String advisor;
    private int memberCount;
    private Date establishedDate;
    private String status;
    private String email;
    private String meetingDay;
    private String meetingTime;
    private int userId;
    private String userEmail;

    // Default constructor
    public ClubDTO() {}

    // Constructor for mapping from Club entity
    public ClubDTO(int cid, String cname, String description, Date date, boolean status, 
                   String userEmail, String userName, int userId) {
        this.id = cid;
        this.name = cname;
        this.description = description;
        this.establishedDate = date;
        this.status = status ? "Active" : "Pending";
        this.president = userName;
        this.email = userEmail;
        this.userId = userId;
        this.userEmail = userEmail;
        this.category = "General"; // Default category
        this.advisor = "TBD"; // Default advisor
        this.memberCount = 0; // Will be populated separately
        this.meetingDay = "TBD";
        this.meetingTime = "TBD";
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPresident() {
        return president;
    }

    public void setPresident(String president) {
        this.president = president;
    }

    public String getAdvisor() {
        return advisor;
    }

    public void setAdvisor(String advisor) {
        this.advisor = advisor;
    }

    public int getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }

    public Date getEstablishedDate() {
        return establishedDate;
    }

    public void setEstablishedDate(Date establishedDate) {
        this.establishedDate = establishedDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMeetingDay() {
        return meetingDay;
    }

    public void setMeetingDay(String meetingDay) {
        this.meetingDay = meetingDay;
    }

    public String getMeetingTime() {
        return meetingTime;
    }

    public void setMeetingTime(String meetingTime) {
        this.meetingTime = meetingTime;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}

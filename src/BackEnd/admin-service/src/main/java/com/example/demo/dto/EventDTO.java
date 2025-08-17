package com.example.demo.dto;

import java.util.Date;

public class EventDTO {
    private int id;
    private String title;
    private String description;
    private String club;
    private Date date;
    private String time;
    private String location;
    private int capacity;
    private int registeredCount;
    private String status;
    private String organizer;
    private String type;
    private String banner;
    private int clubId;

    // Default constructor
    public EventDTO() {}

    // Constructor for mapping from Events entity
    public EventDTO(int eid, String description, String clubName, boolean status, String banner, int clubId) {
        this.id = eid;
        this.description = description;
        this.club = clubName;
        this.status = status ? "Active" : "Pending";
        this.banner = banner;
        this.clubId = clubId;
        
        // Set default values for fields not in your entity
        this.title = description.length() > 50 ? description.substring(0, 50) + "..." : description;
        this.date = new Date(); // Default to current date
        this.time = "TBD";
        this.location = "TBD";
        this.capacity = 100;
        this.registeredCount = 0;
        this.organizer = "Club Admin";
        this.type = "General";
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getClub() {
        return club;
    }

    public void setClub(String club) {
        this.club = club;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getRegisteredCount() {
        return registeredCount;
    }

    public void setRegisteredCount(int registeredCount) {
        this.registeredCount = registeredCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getBanner() {
        return banner;
    }

    public void setBanner(String banner) {
        this.banner = banner;
    }

    public int getClubId() {
        return clubId;
    }

    public void setClubId(int clubId) {
        this.clubId = clubId;
    }
}

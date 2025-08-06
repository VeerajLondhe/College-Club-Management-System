package com.example.demo.controllers;

import com.example.demo.entities.Events;
import com.example.demo.services.EventsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventsController {

    @Autowired
    private EventsService eventsService;

    // Get all approved events of an active club
    @GetMapping("/club/{clubId}")
    public List<Events> getActiveEventsByClub(@PathVariable int clubId) {
        return eventsService.getApprovedEventsByClubId(clubId);
    }

    // Get all unapproved events (admin)
    @GetMapping("/pending")
    public List<Events> getAllPendingEvents() {
        return eventsService.getAllPendingEvents();
    }

    // Approve event by ID (admin)
    @PutMapping("/approve/{eventId}")
    public String approveEvent(@PathVariable int eventId) {
        boolean approved = eventsService.approveEvent(eventId);
        return approved ? "Event approved successfully" : "Event not found";
    }

    // Delete event by ID (admin)
    @DeleteMapping("/delete/{eventId}")
    public String deleteEvent(@PathVariable int eventId) {
        boolean deleted = eventsService.deleteEvent(eventId);
        return deleted ? "Event deleted successfully" : "Event not found";
    }
}

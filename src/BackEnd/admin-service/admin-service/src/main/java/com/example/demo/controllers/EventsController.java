package com.example.demo.controllers;

import com.example.demo.entities.Events;
import com.example.demo.services.EventsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class EventsController {

    @Autowired
    private EventsService eventsService;

    
    @GetMapping("/club/{clubId}")
    public List<Events> getActiveEventsByClub(@PathVariable int clubId) {
        return eventsService.getApprovedEventsByClubId(clubId);
    }

    
    @GetMapping("/pending")
    public List<Events> getAllPendingEvents() {
        return eventsService.getAllPendingEvents();
    }

    
    @PutMapping("/approve/{eventId}")
    public String approveEvent(@PathVariable int eventId) {
        boolean approved = eventsService.approveEvent(eventId);
        return approved ? "Event approved successfully" : "Event not found";
    }

   
    @DeleteMapping("/delete/{eventId}")
    public String deleteEvent(@PathVariable int eventId) {
        boolean deleted = eventsService.deleteEvent(eventId);
        return deleted ? "Event deleted successfully" : "Event not found";
    }
}

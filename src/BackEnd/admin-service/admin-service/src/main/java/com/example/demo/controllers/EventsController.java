package com.example.demo.controllers;

import com.example.demo.dto.EventDTO;
import com.example.demo.entities.Events;
import com.example.demo.services.EventsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    
    @GetMapping("/all")
    public ResponseEntity<List<Events>> getAllEvents() {
        List<Events> events = eventsService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    
    @PutMapping("/approve/{eventId}")
    public String approveEvent(@PathVariable int eventId) {
        boolean approved = eventsService.approveEvent(eventId);
        return approved ? "Event approved successfully" : "Event not found";
    }

   
    @DeleteMapping("/delete/{eventId}")
    public ResponseEntity<Map<String, Object>> deleteEvent(@PathVariable int eventId) {
        try {
            System.out.println("🎯 DELETE endpoint called for event ID: " + eventId);
            boolean deleted = eventsService.deleteEvent(eventId);
            
            Map<String, Object> response = new HashMap<>();
            if (deleted) {
                response.put("success", true);
                response.put("message", "Event deleted successfully");
                response.put("eventId", eventId);
                System.out.println("✅ DELETE endpoint - success response");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Event not found or could not be deleted");
                response.put("eventId", eventId);
                System.out.println("❌ DELETE endpoint - event not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("💥 DELETE endpoint exception: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete event: " + e.getMessage());
            response.put("eventId", eventId);
            return ResponseEntity.status(500).body(response);
        }
    }

    // Implemented endpoints for frontend integration
    @GetMapping("/{id}")
    public ResponseEntity<Events> getEventById(@PathVariable int id) {
        try {
            Optional<Events> event = eventsService.getEventById(id);
            if (event.isPresent()) {
                return ResponseEntity.ok(event.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createEvent(@RequestBody EventDTO eventDTO) {
        try {
            String result = eventsService.createEvent(eventDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create event: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateEvent(@PathVariable int id, @RequestBody EventDTO eventDTO) {
        try {
            String result = eventsService.updateEvent(id, eventDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update event: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{eventId}/attendees")
    public ResponseEntity<List<Object>> getEventAttendees(@PathVariable int eventId) {
        try {
            List<Object> attendees = eventsService.getEventAttendees(eventId);
            return ResponseEntity.ok(attendees);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(List.of());
        }
    }

    @PostMapping("/{eventId}/register")
    public ResponseEntity<Map<String, Object>> registerForEvent(@PathVariable int eventId, @RequestBody Map<String, Integer> request) {
        try {
            Integer memberId = request.get("memberId");
            String result = eventsService.registerForEvent(eventId, memberId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to register: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{eventId}/register/{memberId}")
    public ResponseEntity<Map<String, Object>> unregisterFromEvent(@PathVariable int eventId, @PathVariable int memberId) {
        try {
            String result = eventsService.unregisterFromEvent(eventId, memberId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to unregister: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDTO>> getUpcomingEvents() {
        try {
            List<EventDTO> events = eventsService.getActiveEventDTOs();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(List.of());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Events>> searchEvents(@RequestParam String q) {
        try {
            List<Events> events = eventsService.searchEvents(q);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(List.of());
        }
    }

    @GetMapping("/user/{userId}/registered")
    public ResponseEntity<List<Events>> getUserRegisteredEvents(@PathVariable int userId) {
        try {
            List<Events> events = eventsService.getUserRegisteredEvents(userId);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(List.of());
        }
    }

    @PostMapping("/submit-for-approval")
    public ResponseEntity<Map<String, Object>> submitEventForApproval(@RequestBody EventDTO eventDTO) {
        try {
            String result = eventsService.submitEventForApproval(eventDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to submit event: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/pending-approval")
    public ResponseEntity<List<Events>> getPendingEvents() {
        return ResponseEntity.ok(eventsService.getAllPendingEvents());
    }

    @PutMapping("/{eventId}/approve")
    public ResponseEntity<String> approveEventById(@PathVariable int eventId) {
        boolean approved = eventsService.approveEvent(eventId);
        return ResponseEntity.ok(approved ? "Event approved successfully" : "Event not found");
    }

    @PutMapping("/{eventId}/reject")
    public ResponseEntity<Map<String, Object>> rejectEvent(@PathVariable int eventId, @RequestBody Map<String, String> request) {
        try {
            String reason = request.get("reason");
            String result = eventsService.rejectEvent(eventId, reason);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to reject event: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/approval-status/{status}")
    public ResponseEntity<List<Events>> getEventsByApprovalStatus(@PathVariable String status) {
        try {
            boolean boolStatus = "approved".equalsIgnoreCase(status) || "active".equalsIgnoreCase(status);
            List<Events> allEvents = eventsService.getAllEvents();
            List<Events> events = new ArrayList<>();
            
            for (Events event : allEvents) {
                if (boolStatus && event.isStatus()) {
                    events.add(event);
                } else if (!boolStatus && !event.isStatus()) {
                    events.add(event);
                }
            }
            
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }

    @GetMapping("/club-head/{userId}/submitted")
    public ResponseEntity<List<Events>> getClubHeadSubmittedEvents(@PathVariable int userId) {
        try {
            List<Events> events = eventsService.getEventsByClubHeadUserId(userId);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(List.of());
        }
    }
}

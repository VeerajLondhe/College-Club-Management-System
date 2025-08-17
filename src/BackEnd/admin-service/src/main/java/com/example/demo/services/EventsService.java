package com.example.demo.services;

import com.example.demo.dto.EventDTO;
import com.example.demo.entities.Club;
import com.example.demo.entities.Events;
import com.example.demo.repositories.EventsRepository;
import com.example.demo.repositories.ClubRepository;
import com.example.demo.repositories.EventTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EventsService {

    @Autowired
    private EventsRepository eventsRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private EventTaskRepository eventTaskRepository;

    // Get all events as entities (existing functionality)
    public List<Events> getAllEvents() {
        return (List<Events>) eventsRepository.findAll();
    }

    // Get all events as DTOs (for frontend)
    public List<EventDTO> getAllEventDTOs() {
        List<Object[]> eventData = eventsRepository.findAllEventData();
        return mapToEventDTOs(eventData);
    }

    // Get active events as DTOs
    public List<EventDTO> getActiveEventDTOs() {
        List<Object[]> eventData = eventsRepository.findActiveEventData();
        return mapToEventDTOs(eventData);
    }

    // Get pending events as DTOs
    public List<EventDTO> getPendingEventDTOs() {
        List<Object[]> eventData = eventsRepository.findPendingEventData();
        return mapToEventDTOs(eventData);
    }

    // Helper method to map Object[] to EventDTO
    private List<EventDTO> mapToEventDTOs(List<Object[]> eventData) {
        List<EventDTO> events = new ArrayList<>();
        for (Object[] data : eventData) {
            int eid = (Integer) data[0];
            String description = (String) data[1];
            String clubName = (String) data[2];
            Boolean status = (Boolean) data[3];
            byte[] bannerBytes = (byte[]) data[4];
            Integer clubId = (Integer) data[5];

            String banner = null;
            if (bannerBytes != null && bannerBytes.length > 0) {
                banner = "data:image/jpeg;base64," + java.util.Base64.getEncoder().encodeToString(bannerBytes);
            }

            EventDTO dto = new EventDTO(eid, description, clubName, status, banner, clubId);
            events.add(dto);
        }
        return events;
    }

    public List<Events> getApprovedEventsByClubId(int clubId) {
        return eventsRepository.findApprovedEventsByClubId(clubId);
    }

    public List<Events> getAllPendingEvents() {
        return eventsRepository.findPendingEvents();
    }

    // Get event by ID
    public Optional<Events> getEventById(int eventId) {
        return eventsRepository.findById(eventId);
    }

    // Get events by club ID
    public List<Events> getEventsByClubId(int clubId) {
        return eventsRepository.findByClubId(clubId);
    }

    // Get events by club head user ID
    public List<Events> getEventsByClubHeadUserId(int userId) {
        return eventsRepository.findByClubHeadUserId(userId);
    }

    // Search events
    public List<Events> searchEvents(String query) {
        return eventsRepository.searchByDescription(query);
    }

    // Create event
    public String createEvent(EventDTO eventDTO) {
        try {
            Optional<Club> clubOpt = clubRepository.findById(eventDTO.getClubId());
            if (clubOpt.isPresent()) {
                Events event = new Events();
                event.setDescription(eventDTO.getDescription());
                event.setClub(clubOpt.get());
                event.setStatus(false); // New events start as pending
                
                eventsRepository.save(event);
                return "Event created successfully";
            } else {
                return "Club not found";
            }
        } catch (Exception e) {
            return "Failed to create event: " + e.getMessage();
        }
    }

    // Update event
    public String updateEvent(int eventId, EventDTO eventDTO) {
        try {
            Optional<Events> eventOpt = eventsRepository.findById(eventId);
            if (eventOpt.isPresent()) {
                Events event = eventOpt.get();
                event.setDescription(eventDTO.getDescription());
                
                eventsRepository.save(event);
                return "Event updated successfully";
            } else {
                return "Event not found";
            }
        } catch (Exception e) {
            return "Failed to update event: " + e.getMessage();
        }
    }

    // Submit event for approval
    public String submitEventForApproval(EventDTO eventDTO) {
        return createEvent(eventDTO); // Same as create, but can be extended for specific logic
    }

    public boolean approveEvent(int eventId) {
        Optional<Events> eventOpt = eventsRepository.findById(eventId);
        if (eventOpt.isPresent()) {
            Events event = eventOpt.get();
            event.setStatus(true);
            eventsRepository.save(event);
            return true;
        }
        return false;
    }

    // Reject event
    public String rejectEvent(int eventId, String reason) {
        try {
            Optional<Events> eventOpt = eventsRepository.findById(eventId);
            if (eventOpt.isPresent()) {
                Events event = eventOpt.get();
                event.setStatus(false);
                // In a real implementation, you might want to store the rejection reason
                eventsRepository.save(event);
                return "Event rejected: " + reason;
            } else {
                return "Event not found";
            }
        } catch (Exception e) {
            return "Failed to reject event: " + e.getMessage();
        }
    }

    @Transactional
    public boolean deleteEvent(int eventId) {
        try {
            System.out.println("🗑️ Attempting to delete event with ID: " + eventId);
            
            // First check if the event exists
            boolean exists = eventsRepository.existsById(eventId);
            System.out.println("📋 Event exists check: " + exists);
            
            if (exists) {
                // Get the event first to see what we're dealing with
                Optional<Events> eventOpt = eventsRepository.findById(eventId);
                if (eventOpt.isPresent()) {
                    Events event = eventOpt.get();
                    System.out.println("📄 Event to delete: " + event.toString());
                    System.out.println("🏛️ Club ID: " + (event.getClub() != null ? event.getClub().getCid() : "NULL"));
                    
                    // STEP 1: Handle cascading deletes for EventTask entities
                    System.out.println("🔗 Checking for EventTask dependencies...");
                    long eventTaskCount = eventTaskRepository.countByEventId(eventId);
                    System.out.println("📊 Found " + eventTaskCount + " EventTask records for this event");
                    
                    if (eventTaskCount > 0) {
                        System.out.println("🗑️ Deleting EventTask records first (cascading delete)...");
                        eventTaskRepository.deleteByEventId(eventId);
                        
                        // Verify EventTask deletion
                        long remainingEventTasks = eventTaskRepository.countByEventId(eventId);
                        System.out.println("✅ Remaining EventTask records: " + remainingEventTasks);
                    }
                    
                    // STEP 2: Now delete the event itself
                    System.out.println("🔧 Executing event deleteById...");
                    eventsRepository.deleteById(eventId);
                    
                    // STEP 3: Verify deletion
                    boolean stillExists = eventsRepository.existsById(eventId);
                    System.out.println("✅ Deletion verification - Event still exists: " + stillExists);
                    
                    if (!stillExists) {
                        System.out.println("✅ Event successfully deleted!");
                        return true;
                    } else {
                        System.err.println("❌ Event still exists after delete operation");
                        return false;
                    }
                } else {
                    System.err.println("❌ Event exists but couldn't retrieve it");
                    return false;
                }
            } else {
                System.err.println("❌ Event with ID " + eventId + " not found");
                return false;
            }
        } catch (Exception e) {
            // Log the error and return false
            System.err.println("💥 Error deleting event: " + e.getMessage());
            System.err.println("📊 Exception type: " + e.getClass().getSimpleName());
            e.printStackTrace();
            
            // Check if it's a foreign key constraint issue
            if (e.getMessage() != null && (e.getMessage().contains("foreign key") || 
                                         e.getMessage().contains("constraint") ||
                                         e.getMessage().contains("violates") ||
                                         e.getMessage().contains("cannot delete") ||
                                         e.getMessage().contains("referenced by"))) {
                System.err.println("🔗 This appears to be a foreign key constraint violation.");
                System.err.println("💡 The event might be referenced by other tables that we haven't handled.");
                System.err.println("💡 Consider implementing soft delete or adding more cascading delete logic.");
            }
            
            return false;
        }
    }

    // Placeholder methods for event registration (would need separate entity/table)
    public List<Object> getEventAttendees(int eventId) {
        // Placeholder - would need EventRegistration entity
        return new ArrayList<>();
    }

    public String registerForEvent(int eventId, int memberId) {
        // Placeholder - would need EventRegistration entity
        return "Registered for event successfully";
    }

    public String unregisterFromEvent(int eventId, int memberId) {
        // Placeholder - would need EventRegistration entity
        return "Unregistered from event successfully";
    }

    public List<Events> getUserRegisteredEvents(int userId) {
        // Placeholder - would need EventRegistration entity
        return new ArrayList<>();
    }
}

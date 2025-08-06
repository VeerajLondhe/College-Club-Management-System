package com.example.demo.services;

import com.example.demo.entities.Events;
import com.example.demo.repositories.EventsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventsService {

    @Autowired
    private EventsRepository eventsRepository;

    public List<Events> getApprovedEventsByClubId(int clubId) {
        return eventsRepository.findActiveEventsByClubId(clubId);
    }

    public List<Events> getAllPendingEvents() {
        return eventsRepository.findByStatusFalse();
    }

    public boolean approveEvent(int eventId) {
        Optional<Events> optionalEvent = eventsRepository.findById(eventId);
        if (optionalEvent.isPresent()) {
            Events event = optionalEvent.get();
            event.setStatus(true);
            eventsRepository.save(event);
            return true;
        }
        return false;
    }

    public boolean deleteEvent(int eventId) {
        if (eventsRepository.existsById(eventId)) {
            eventsRepository.deleteById(eventId);
            return true;
        }
        return false;
    }
}

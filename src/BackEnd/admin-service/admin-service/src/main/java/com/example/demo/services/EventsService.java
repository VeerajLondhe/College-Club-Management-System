package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Events;
import com.example.demo.repositories.EventsRepository;

@Service
public class EventsService {

    @Autowired
    private EventsRepository eventsRepo;

    public List<Events> getAllEventsOfActiveClubs() {
        return eventsRepo.findEventsOfActiveClubs();
    }

    public List<Events> getEventsByClubId(int clubId) {
        return eventsRepo.findByClubCid(clubId);
    }
}

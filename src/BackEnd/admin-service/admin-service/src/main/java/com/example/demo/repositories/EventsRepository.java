package com.example.demo.repositories;

import com.example.demo.entities.Events;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EventsRepository extends JpaRepository<Events, Integer> {

    @Query("SELECT e FROM Events e WHERE e.club.cid = :cid AND e.club.status = true AND e.status = true")
    List<Events> findActiveEventsByClubId(int cid);

    @Query("SELECT e FROM Events e WHERE e.status = false")
    List<Events> findByStatusFalse();
}

package com.example.demo.repositories;

import com.example.demo.entities.EventTask;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventTaskRepository extends CrudRepository<EventTask, Integer> {
    
    // Find all EventTasks for a specific event
    @Query("SELECT et FROM EventTask et WHERE et.event.eid = :eventId")
    List<EventTask> findByEventId(@Param("eventId") int eventId);
    
    // Delete all EventTasks for a specific event (for cascading delete)
    @Modifying
    @Query("DELETE FROM EventTask et WHERE et.event.eid = :eventId")
    void deleteByEventId(@Param("eventId") int eventId);
    
    // Check if any EventTasks exist for a specific event
    @Query("SELECT COUNT(et) FROM EventTask et WHERE et.event.eid = :eventId")
    long countByEventId(@Param("eventId") int eventId);
}

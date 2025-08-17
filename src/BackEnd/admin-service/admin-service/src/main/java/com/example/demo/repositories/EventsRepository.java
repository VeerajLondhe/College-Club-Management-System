package com.example.demo.repositories;

import com.example.demo.entities.Events;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventsRepository extends CrudRepository<Events, Integer> {

    @Query("SELECT e FROM Events e WHERE e.club.cid = ?1 AND e.status = true")
    List<Events> findApprovedEventsByClubId(int clubId);

    @Query("SELECT e FROM Events e WHERE e.status = false")
    List<Events> findPendingEvents();

    // Get all event data with club information for DTOs
    @Query("SELECT e.eid, e.description, e.club.cname, e.status, e.banner, e.club.cid " +
           "FROM Events e")
    List<Object[]> findAllEventData();

    // Get active event data
    @Query("SELECT e.eid, e.description, e.club.cname, e.status, e.banner, e.club.cid " +
           "FROM Events e WHERE e.status = true")
    List<Object[]> findActiveEventData();

    // Get pending event data
    @Query("SELECT e.eid, e.description, e.club.cname, e.status, e.banner, e.club.cid " +
           "FROM Events e WHERE e.status = false")
    List<Object[]> findPendingEventData();

    // Find events by club ID
    @Query("SELECT e FROM Events e WHERE e.club.cid = :clubId")
    List<Events> findByClubId(@Param("clubId") int clubId);

    // Find events by club head user ID
    @Query("SELECT e FROM Events e WHERE e.club.user.uid = :userId")
    List<Events> findByClubHeadUserId(@Param("userId") int userId);

    // Search events by description
    @Query("SELECT e FROM Events e WHERE e.description LIKE %:query%")
    List<Events> searchByDescription(@Param("query") String query);
}

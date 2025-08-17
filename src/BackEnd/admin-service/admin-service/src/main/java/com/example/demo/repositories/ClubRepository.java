package com.example.demo.repositories;

import com.example.demo.entities.Club;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClubRepository extends CrudRepository<Club, Integer> {

    @Query("SELECT c FROM Club c WHERE c.status = true")
    List<Club> findActiveClubs();

    @Query("SELECT c.cid, c.cname, c.description, c.status, c.date FROM Club c WHERE c.status = true")
    List<Object[]> findBasicActiveClubs();

    List<Club> findByStatus(boolean status);

    // Find club by user ID (club head)
    @Query("SELECT c FROM Club c WHERE c.user.uid = :userId")
    Optional<Club> findByUserId(@Param("userId") int userId);

    // Get club members count
    @Query("SELECT COUNT(cm) FROM ClubMember cm WHERE cm.club.cid = :clubId AND cm.req_status = true")
    Long getClubMemberCount(@Param("clubId") int clubId);

    // Get all club data with member counts for DTOs
    @Query("SELECT c.cid, c.cname, c.description, c.date, c.status, c.user.email, c.user.uname, c.user.uid " +
           "FROM Club c")
    List<Object[]> findAllClubData();

    // Get active club data with member counts for DTOs
    @Query("SELECT c.cid, c.cname, c.description, c.date, c.status, c.user.email, c.user.uname, c.user.uid " +
           "FROM Club c WHERE c.status = true")
    List<Object[]> findActiveClubData();
}

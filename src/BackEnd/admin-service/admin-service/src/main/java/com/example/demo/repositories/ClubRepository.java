package com.example.demo.repositories;

import com.example.demo.entities.Club;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ClubRepository extends CrudRepository<Club, Integer> {

  
    @Query("SELECT c FROM Club c WHERE c.status = true")
    List<Club> findActiveClubs();

    
    @Query("SELECT c.cid, c.cname, c.description, c.status, c.date FROM Club c WHERE c.status = true")
    List<Object[]> findBasicActiveClubs();

    
    List<Club> findByStatus(boolean status);
}

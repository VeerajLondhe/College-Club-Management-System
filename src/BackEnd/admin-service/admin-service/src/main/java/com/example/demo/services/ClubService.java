package com.example.demo.services;

import com.example.demo.entities.Club;
import com.example.demo.entities.User;
import com.example.demo.repositories.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepo;

    // Return only basic info (no events)
    public List<Club> getActiveClubsBasicInfo() {
        List<Object[]> rows = clubRepo.findBasicActiveClubs();
        List<Club> clubs = new ArrayList<>();

        for (Object[] obj : rows) {
            Integer cid = (Integer) obj[0];
            String cname = (String) obj[1];
            String description = (String) obj[2];
            java.sql.Timestamp timestamp = (java.sql.Timestamp) obj[3];
            Boolean status = (Boolean) obj[4];
            User userId=(User)obj[5];
            Club club = new Club(cid, cname, description, timestamp, status,userId,null);
            clubs.add(club);
        }

        return clubs;
    }

    
    public Club getClubById(int id) {
        return clubRepo.findById(id).orElse(null);
    }
    
    public List<Club> getAllInactiveClubs() {
        return clubRepo.findByStatus(false);
    }
    public Club approveClub(int id) {
        Club club = clubRepo.findById(id).orElse(null);
        if (club != null && !club.isStatus()) {
            club.setStatus(true);
            clubRepo.save(club);
        }
        return club;
    }
    public void deleteClubById(int id) {
        if (clubRepo.existsById(id)) {
            clubRepo.deleteById(id);
        } else {
            throw new RuntimeException("Club with ID " + id + " not found");
        }
    }

}

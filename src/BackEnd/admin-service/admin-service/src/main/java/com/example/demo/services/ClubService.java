package com.example.demo.services;

import com.example.demo.entities.Club;
import com.example.demo.entities.User;
import com.example.demo.repositories.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    

    
    public List<Club> getAllClubs() {
        return (List<Club>) clubRepo.findAll();
    }


  
    public List<Club> getActiveClubs() {
        return clubRepo.findActiveClubs();
    }

    
    public List<Object[]> getBasicActiveClubs() {
        return clubRepo.findBasicActiveClubs();
    }

    
    public List<Club> getClubsByStatus(boolean status) {
        return clubRepo.findByStatus(status);
    }

   
    public Optional<Club> getClubById(int id) {
        return clubRepo.findById(id);
    }

    
    public String approveClub(int id) {
        Optional<Club> optionalClub = clubRepo.findById(id);
        if (optionalClub.isPresent()) {
            Club club = optionalClub.get();
            club.setStatus(true);
            clubRepo.save(club);
            return "Club approved successfully.";
        } else {
            return "Club not found.";
        }
    }

   
    public String deleteClub(int id) {
        if (clubRepo.existsById(id)) {
            clubRepo.deleteById(id);
            return "Club deleted successfully.";
        } else {
            return "Club not found.";
        }
    }
}

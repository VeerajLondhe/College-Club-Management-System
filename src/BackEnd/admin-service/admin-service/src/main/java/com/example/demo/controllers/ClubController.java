package com.example.demo.controllers;

import com.example.demo.entities.Club;
import com.example.demo.services.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/clubs")
@CrossOrigin(origins = "*")
public class ClubController {

    @Autowired
    private ClubService clubService;

    
    @GetMapping("/all")
    public List<Club> getAllClubs() {
        return clubService.getAllClubs();
    }

    
    @GetMapping("/active")
    public List<Club> getActiveClubs() {
        return clubService.getActiveClubs();
    }

    
    @GetMapping("/basic-active")
    public List<Object[]> getBasicActiveClubs() {
        return clubService.getBasicActiveClubs();
    }

 
    @GetMapping("/status/{status}")
    public List<Club> getClubsByStatus(@PathVariable boolean status) {
        return clubService.getClubsByStatus(status);
    }

    
    @GetMapping("/{id}")
    public Optional<Club> getClubById(@PathVariable int id) {
        return clubService.getClubById(id);
    }

    
    @PutMapping("/approve/{id}")
    public String approveClub(@PathVariable int id) {
        return clubService.approveClub(id);
    }

 
    @DeleteMapping("/delete/{id}")
    public String deleteClub(@PathVariable int id) {
        return clubService.deleteClub(id);
    }
}

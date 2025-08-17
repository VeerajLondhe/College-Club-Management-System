package com.example.demo.controllers;

import com.example.demo.dto.ClubDTO;
import com.example.demo.entities.Club;
import com.example.demo.entities.ClubMember;
import com.example.demo.entities.Events;
import com.example.demo.entities.User;
import com.example.demo.services.ClubService;
import com.example.demo.services.EventsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin/clubs")
@CrossOrigin(origins = "http://localhost:3000")
public class ClubController {

    @Autowired
    private ClubService clubService;

    @Autowired
    private EventsService eventsService;

    
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

    // Updated endpoints with full implementation
    @PostMapping
    public ResponseEntity<Map<String, Object>> createClub(@RequestBody ClubDTO clubDTO) {
        try {
            // For now, we'll use a dummy user. In real implementation, get from JWT token
            User dummyUser = new User();
            dummyUser.setUid(1); // This should come from authenticated user
            
            String result = clubService.createClub(clubDTO, dummyUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create club: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateClub(@PathVariable int id, @RequestBody ClubDTO clubDTO) {
        try {
            String result = clubService.updateClub(id, clubDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update club: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{clubId}/members")
    public ResponseEntity<List<ClubMember>> getClubMembers(@PathVariable int clubId) {
        try {
            List<ClubMember> members = clubService.getClubMembers(clubId);
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }

    @PostMapping("/{clubId}/members")
    public ResponseEntity<Map<String, Object>> addMemberToClub(@PathVariable int clubId, @RequestBody Map<String, Integer> request) {
        try {
            Integer memberId = request.get("memberId");
            String result = clubService.addMemberToClub(clubId, memberId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to add member: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{clubId}/members/{memberId}")
    public ResponseEntity<Map<String, Object>> removeMemberFromClub(@PathVariable int clubId, @PathVariable int memberId) {
        try {
            String result = clubService.removeMemberFromClub(clubId, memberId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to remove member: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{clubId}/events")
    public ResponseEntity<List<Events>> getClubEvents(@PathVariable int clubId) {
        try {
            List<Events> events = eventsService.getEventsByClubId(clubId);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }

    @GetMapping("/head/{userId}")
    public ResponseEntity<ClubDTO> getClubByHead(@PathVariable int userId) {
        try {
            Optional<Club> clubOpt = clubService.getClubByUserId(userId);
            if (clubOpt.isPresent()) {
                Club club = clubOpt.get();
                ClubDTO dto = new ClubDTO(club.getCid(), club.getCname(), club.getDescription(), 
                                         club.getDate(), club.isStatus(), club.getUser().getEmail(), 
                                         club.getUser().getUname(), club.getUser().getUid());
                return ResponseEntity.ok(dto);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

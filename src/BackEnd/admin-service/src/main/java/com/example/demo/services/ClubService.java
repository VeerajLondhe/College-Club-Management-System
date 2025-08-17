package com.example.demo.services;

import com.example.demo.dto.ClubDTO;
import com.example.demo.entities.Club;
import com.example.demo.entities.ClubMember;
import com.example.demo.entities.User;
import com.example.demo.repositories.ClubMemberRepository;
import com.example.demo.repositories.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ClubService {

	@Autowired
	private ClubRepository clubRepository;

	@Autowired
	private ClubMemberRepository cmrepo;

	// Get all clubs as entities (for existing functionality)
	public List<Club> getAllClubs() {
		return (List<Club>) clubRepository.findAll();
	}

	// Get all clubs as DTOs (for frontend)
	public List<ClubDTO> getAllClubDTOs() {
		List<Object[]> clubData = clubRepository.findAllClubData();
		return mapToClubDTOs(clubData);
	}

	// Get active clubs as DTOs
	public List<ClubDTO> getActiveClubDTOs() {
		List<Object[]> clubData = clubRepository.findActiveClubData();
		return mapToClubDTOs(clubData);
	}

	// Helper method to map Object[] to ClubDTO
	private List<ClubDTO> mapToClubDTOs(List<Object[]> clubData) {
		List<ClubDTO> clubs = new ArrayList<>();
		for (Object[] data : clubData) {
			int cid = (Integer) data[0];
			String cname = (String) data[1];
			String description = (String) data[2];
			Date date = (Date) data[3];
			Boolean status = (Boolean) data[4];
			String userEmail = (String) data[5];
			String userName = (String) data[6];
			Integer userId = (Integer) data[7];

			ClubDTO dto = new ClubDTO(cid, cname, description, date, status, userEmail, userName, userId);
			
			// Get member count
			Long memberCount = clubRepository.getClubMemberCount(cid);
			dto.setMemberCount(memberCount != null ? memberCount.intValue() : 0);

			clubs.add(dto);
		}
		return clubs;
	}

	@Transactional
	public String deleteClub(int clubId) {
		if (clubRepository.existsById(clubId)) {
			// First delete all club members for this club
			cmrepo.deleteByClub_Cid(clubId);
			// Then delete the club
			clubRepository.deleteById(clubId);
			return "Club deleted successfully.";
		} else {
			return "Club not found.";
		}
	}

	public List<Club> getActiveClubs() {
		return clubRepository.findActiveClubs();
	}

	public List<Object[]> getBasicActiveClubs() {
		return clubRepository.findBasicActiveClubs();
	}

	public List<Club> getClubsByStatus(boolean status) {
		return clubRepository.findByStatus(status);
	}

	public Optional<Club> getClubById(int id) {
		return clubRepository.findById(id);
	}

	// Get club by user ID (club head)
	public Optional<Club> getClubByUserId(int userId) {
		return clubRepository.findByUserId(userId);
	}

	public String approveClub(int id) {
		Optional<Club> optionalClub = clubRepository.findById(id);
		if (optionalClub.isPresent()) {
			ClubMember cm = new ClubMember();
			cm.setuId(optionalClub.get().getUser());
			cm.setcId(optionalClub.get());
			cm.setPosition("club_head");
			cm.setReq_status(true);
			Club club = optionalClub.get();
			club.setStatus(true);
			cmrepo.save(cm);
			clubRepository.save(club);
			return "Club approved successfully.";
		} else {
			return "Club not found.";
		}
	}

	// Create new club
	public String createClub(ClubDTO clubDTO, User user) {
		try {
			Club club = new Club();
			club.setCname(clubDTO.getName());
			club.setDescription(clubDTO.getDescription());
			club.setDate(new java.sql.Date(System.currentTimeMillis()));
			club.setStatus(false); // New clubs start as pending
			club.setUser(user);

			clubRepository.save(club);
			return "Club creation request submitted successfully";
		} catch (Exception e) {
			return "Failed to create club: " + e.getMessage();
		}
	}

	// Update club
	public String updateClub(int id, ClubDTO clubDTO) {
		Optional<Club> optionalClub = clubRepository.findById(id);
		if (optionalClub.isPresent()) {
			Club club = optionalClub.get();
			club.setCname(clubDTO.getName());
			club.setDescription(clubDTO.getDescription());
			
			clubRepository.save(club);
			return "Club updated successfully";
		} else {
			return "Club not found";
		}
	}

	// Get club members
	public List<ClubMember> getClubMembers(int clubId) {
		return cmrepo.findByClubCidAndReqStatus(clubId, true);
	}

	// Add member to club
	public String addMemberToClub(int clubId, int memberId) {
		try {
			// Implementation would require User entity access
			// This is a placeholder for the actual implementation
			return "Member added to club successfully";
		} catch (Exception e) {
			return "Failed to add member: " + e.getMessage();
		}
	}

	// Remove member from club
	public String removeMemberFromClub(int clubId, int memberId) {
		try {
			cmrepo.deleteByClubCidAndUserId(clubId, memberId);
			return "Member removed from club successfully";
		} catch (Exception e) {
			return "Failed to remove member: " + e.getMessage();
		}
	}
}

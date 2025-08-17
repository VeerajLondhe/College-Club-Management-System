package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entities.ClubMember;

import java.util.List;

public interface ClubMemberRepository extends JpaRepository<ClubMember, Integer> {
	// Use Spring Data JPA method naming convention instead of custom query
	void deleteByClub_Cid(int cid);

	// Find members by club ID and request status
	@Query("SELECT cm FROM ClubMember cm WHERE cm.club.cid = :clubId AND cm.req_status = :status")
	List<ClubMember> findByClubCidAndReqStatus(@Param("clubId") int clubId, @Param("status") boolean status);

	// Delete member by club ID and user ID
	@Modifying
	@Query("DELETE FROM ClubMember cm WHERE cm.club.cid = :clubId AND cm.uId.uid = :userId")
	void deleteByClubCidAndUserId(@Param("clubId") int clubId, @Param("userId") int userId);
}

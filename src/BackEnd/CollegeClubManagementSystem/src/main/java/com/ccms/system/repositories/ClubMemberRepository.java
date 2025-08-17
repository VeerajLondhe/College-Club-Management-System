package com.ccms.system.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ccms.system.entities.ClubMember;
import com.ccms.system.entities.User;

@Repository
public interface ClubMemberRepository extends JpaRepository<ClubMember, Integer> {
	
	@Query(value = "SELECT cm.position FROM club_member cm WHERE cm.u_id = :uid AND cm.req_status = true ORDER BY CASE WHEN cm.position = 'club_head' THEN 1 WHEN cm.position = 'club_member' THEN 2 ELSE 3 END LIMIT 1", nativeQuery = true)
	String getPositon(@Param("uid") int uid);
  
}


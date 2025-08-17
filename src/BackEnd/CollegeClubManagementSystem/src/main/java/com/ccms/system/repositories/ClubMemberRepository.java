package com.ccms.system.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ccms.system.entities.ClubMember;
import com.ccms.system.entities.User;

@Repository
public interface ClubMemberRepository extends JpaRepository<ClubMember, Integer> {
	
	@Query("SELECT  cm.position FROM ClubMember cm WHERE cm.userID = :uid")
	String getPositon(@Param("uid") int uid);
  
}


package com.ccms.system.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import com.ccms.system.dto.UserWithPosition;
import com.ccms.system.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {

	@Query(value = "SELECT * FROM user WHERE email = :username AND password = :password", nativeQuery = true)
	Optional<User> loginNative(@Param("username") String username, @Param("password") String password);
	
	
}

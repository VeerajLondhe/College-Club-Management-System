package com.ccms.system.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import com.ccms.system.CollegeClubManagementSystemApplication;
import com.ccms.system.dto.UserWithPosition;
import com.ccms.system.entities.ClubMember;
import com.ccms.system.entities.Role;
import com.ccms.system.entities.User;
import com.ccms.system.repositories.ClubMemberRepository;
import com.ccms.system.repositories.RoleRepository;
import com.ccms.system.repositories.UserRepository;

@Service
public class UserService {

    private final CollegeClubManagementSystemApplication collegeClubManagementSystemApplication;

	@Autowired
	UserRepository urepo;
	
	@Autowired
	ClubMemberRepository crepo;
	
	@Autowired
	RoleRepository rrepo;

    UserService(CollegeClubManagementSystemApplication collegeClubManagementSystemApplication) {
        this.collegeClubManagementSystemApplication = collegeClubManagementSystemApplication;
    }
	
//	public User insertData(User u) {
//		int roleId=u.getRole().getRid();
//		Role role=rrepo.findById(roleId).get();
//		
//		u.setRole(role);
//		
//		return urepo.save(u);
//	}
	
	public ResponseEntity<User> insertData(User u) {
		try {
		int roleId=u.getRole().getRid();
		Role role=rrepo.findById(roleId).get();
		u.setRole(role);
		urepo.save(u);
		return new ResponseEntity<>(u,HttpStatus.CREATED);
		}catch(Exception e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	
	public ResponseEntity<User> getUserById(int id)
	{
	  Optional<User> user=urepo.findById(id);
	  if(user.isPresent()) {
		  return new ResponseEntity<>(user.get(),HttpStatus.OK);
	  }
	  return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	public List<User> getAll(){
		return urepo.findAll();
	}
	
	 public ResponseEntity<UserWithPosition> login(String username, String password) {
		 	Optional<User> user=urepo.loginNative(username, password);
		 	if(user.isPresent()) {
		 		UserWithPosition uw=new UserWithPosition();
		 		uw.setUid(user.get().getUid());
		 		uw.setUname(user.get().getUname());
		 		uw.setEmail(user.get().getEmail());
		 		uw.setPhoneno(user.get().getPhoneno());
		 		uw.setRole(user.get().getRole());
		 		uw.setDname(user.get().getDname());
		 		uw.setPos(crepo.getPositon(user.get().getUid()));
		 		return new ResponseEntity<>(uw,HttpStatus.OK);
			  }
		 	
		 	return new ResponseEntity<>(HttpStatus.NOT_FOUND);
     }
}
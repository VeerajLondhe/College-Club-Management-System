package com.ccms.system.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.ccms.system.entities.Role;
import com.ccms.system.entities.User;
import com.ccms.system.repositories.RoleRepository;
import com.ccms.system.repositories.UserRepository;

@Service
public class UserService {

	@Autowired
	UserRepository urepo;
	
	@Autowired
	RoleRepository rrepo;
	
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
	
	
	 public Optional<User> login(String username, String password) {
	        return urepo.loginNative(username, password);
	    }
}

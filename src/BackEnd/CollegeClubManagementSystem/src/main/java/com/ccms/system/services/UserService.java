package com.ccms.system.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
	
	public User insertData(User u) {
		int roleId=u.getRole().getRid();
		Role role=rrepo.findById(roleId).get();
		
		u.setRole(role);
		
		return urepo.save(u);
	}
	
	
	public User getUserById(int id)
	{
	  return urepo.findById(id).get();	
	}
	
	
	 public Optional<User> login(String username, String password) {
	        return urepo.loginNative(username, password);
	    }
}

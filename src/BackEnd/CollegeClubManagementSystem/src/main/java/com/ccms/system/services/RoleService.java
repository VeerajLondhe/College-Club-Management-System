package com.ccms.system.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ccms.system.entities.Role;
import com.ccms.system.repositories.RoleRepository;

@Service
public class RoleService {
	
	@Autowired
	RoleRepository rrepo;
	
	
		
	public List<Role> getAll(){
		return rrepo.findAll();
	}
	

}

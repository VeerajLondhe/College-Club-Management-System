package com.ccms.system.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ccms.system.repositories.RoleRepository;

@Service
public class RoleService {
	
	@Autowired
	RoleRepository rrepo;
	
	

}

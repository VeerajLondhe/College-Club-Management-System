package com.ccms.system.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ccms.system.entities.Role;
import com.ccms.system.services.RoleService;

@RestController
@RequestMapping("/role")
public class RoleController {
	@Autowired
	RoleService rservice;
	
	@GetMapping("/all")
	public List<Role> getAll(){
		return rservice.getAll();  
	}
}

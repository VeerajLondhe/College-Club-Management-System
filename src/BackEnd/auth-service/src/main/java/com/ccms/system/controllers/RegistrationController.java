package com.ccms.system.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import com.ccms.system.dto.UserLog;
import com.ccms.system.dto.UserWithPosition;
import com.ccms.system.entities.User;
import com.ccms.system.services.UserService;

@RestController
@RequestMapping("/auth")
public class RegistrationController {
	
	@Autowired
	UserService uservice;
	
	@PostMapping("/user/register")
	public ResponseEntity<?> insertData(@RequestBody User u) {
		return uservice.insertData(u);
	}
	@GetMapping("/user/getbyid")
	public ResponseEntity<User> getUserById(@RequestParam("id") int id)
	{
	  return uservice.getUserById(id);
	}
	
	@GetMapping("/user/all")
	public List<User> getAll(){
		return uservice.getAll();
	}
	
	@PostMapping("/user/login")
	public ResponseEntity<UserWithPosition> login(@RequestBody UserLog user) {
		String username=user.getUsername();
		String password=user.getPassword();
	    return uservice.login(username, password);
	}
	
	
}

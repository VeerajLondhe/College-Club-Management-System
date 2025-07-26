package com.ccms.system.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ccms.system.entities.User;
import com.ccms.system.services.UserService;

@RestController
@RequestMapping("/ccms")
public class RegistrationController {
	
	@Autowired
	UserService uservice;
	
	
	@PostMapping("/register")
	public ResponseEntity<User> insertData(@RequestBody User u) {
		return uservice.insertData(u);
	}
	@GetMapping("/getbyid")
	public ResponseEntity<User> getUserById(@RequestParam("id") int id)
	{
	  return uservice.getUserById(id);
	}
	
	@GetMapping("/login")
	public User login(@RequestParam String username, @RequestParam String password) {
	    return uservice.login(username, password)
	            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password"))
;
	}

}

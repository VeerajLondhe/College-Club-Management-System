package com.ccms.system.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ccms.system.entities.User;
import com.ccms.system.services.UserService;

@RestController
@RequestMapping("/ccms")
public class RegistrationController {
	
	@Autowired
	UserService uservice;
	
	
	@PostMapping("/register")
	public User insertData(@RequestBody User u) {
		return uservice.insertData(u);
	}
	@GetMapping("/getbyid")
	public User getUserById(@RequestParam("id") int id)
	{
	  return uservice.getUserById(id);
	}
}

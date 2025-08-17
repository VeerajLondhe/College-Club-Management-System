package com.ccms.system.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


import com.ccms.system.dto.UserLog;
import com.ccms.system.dto.UserWithPosition;
import com.ccms.system.entities.User;
import com.ccms.system.services.UserService;

@RestController
@RequestMapping("/ccms/user")
@CrossOrigin(origins =  "http://localhost:3000" )
public class RegistrationController {
	
	@Autowired
	UserService uservice;
	
	
	
	@PostMapping("/register")
	public ResponseEntity<?> insertData(@RequestBody User u) {
		return uservice.insertData(u);
	}
	@GetMapping("/getbyid")
	public ResponseEntity<User> getUserById(@RequestParam("id") int id)
	{
	  return uservice.getUserById(id);
	}
	
	@GetMapping("/all")
	public List<User> getAll(){
		return uservice.getAll();
	}
	
	@PostMapping("/login")
	public ResponseEntity<UserWithPosition> login(@RequestBody UserLog user) {
		String username=user.getUsername();
		String password=user.getPassword();
	    return uservice.login(username, password);
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
		String email = request.get("email");
		// TODO: Implement forgot password logic
		return ResponseEntity.ok(Map.of("message", "Password reset email sent"));
	}

	@PostMapping("/reset-password")
	public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
		String token = request.get("token");
		String newPassword = request.get("newPassword");

		return ResponseEntity.ok(Map.of("message", "Password reset successful"));
	}

	@GetMapping("/me")
	public ResponseEntity<User> getCurrentUser(@RequestParam("id") int id) {
		return uservice.getUserById(id);
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout() {

		return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
	}

}

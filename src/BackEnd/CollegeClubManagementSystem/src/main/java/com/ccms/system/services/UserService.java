package com.ccms.system.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import com.ccms.system.CollegeClubManagementSystemApplication;
import com.ccms.system.config.AuthUtil;
import com.ccms.system.dto.UserResponseDTO;
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
	AuthenticationManager authenticationManager;
	
	@Autowired
	AuthUtil authUtil;
	
	@Autowired
	PasswordEncoder passworEncder;
	
	@Autowired
	ClubMemberRepository cmrepo;
	
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
	
	public ResponseEntity<?> insertData(User savedUser) {
		try {
		
		int roleId=savedUser.getRole().getRid();
		Role role=rrepo.findById(roleId).get();
		savedUser.setRole(role);
		String pass=savedUser.getPassword();
		savedUser.setPassword(passworEncder.encode(pass));	
		urepo.save(savedUser);
		
		UserResponseDTO responseDto = new UserResponseDTO();

       
        responseDto.setUid(savedUser.getUid());
        responseDto.setUname(savedUser.getUname());
        responseDto.setEmail(savedUser.getEmail());
        responseDto.setPhoneno(savedUser.getPhoneno());
        responseDto.setDname(savedUser.getDname());
        responseDto.setRole(savedUser.getRole());
		return new ResponseEntity<>(responseDto,HttpStatus.CREATED);
		}catch(Exception e) {
			e.printStackTrace();
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
	    try {
	       
	        Authentication authentication = authenticationManager.authenticate(
	                new UsernamePasswordAuthenticationToken(username, password)
	        );

	        
	        
	        com.ccms.system.entities.User user = urepo.findByEmail(authentication.getName())
	                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database. This should not happen."));

	        
	        String token = authUtil.generateAccessToken(user);
	        
        String pos=cmrepo.getPositon(user.getUid());
	        
	        // If user is not a club member, set position based on role
	        if (pos == null) {
	            String roleName = user.getRole().getRname().toLowerCase();
	            if ("admin".equals(roleName)) {
	                pos = "admin";
	            } else {
	                pos = "student";
	            }
	        }
	        
	        UserWithPosition uw = new UserWithPosition();
	        uw.setUid(user.getUid());
	        uw.setUname(user.getUname());
	        uw.setEmail(user.getEmail());
	        uw.setPhoneno(user.getPhoneno());
	        uw.setRole(user.getRole());
	        uw.setDname(user.getDname());
	        uw.setPos(pos);
	        uw.setJWT(token);
	        
	        return new ResponseEntity<>(uw, HttpStatus.OK);

	    } catch (BadCredentialsException e) {
	        return new ResponseEntity("Invalid username or password", HttpStatus.UNAUTHORIZED);
	    }
	}
}

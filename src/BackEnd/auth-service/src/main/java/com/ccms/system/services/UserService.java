package com.ccms.system.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ccms.system.dto.UserResponseDTO;
import com.ccms.system.dto.UserWithPosition;
import com.ccms.system.entities.Role;
import com.ccms.system.entities.User;
import com.ccms.system.repositories.ClubMemberRepository;
import com.ccms.system.repositories.RoleRepository;
import com.ccms.system.repositories.UserRepository;

@Service
public class UserService {
	//--------------------------------------------------
	@Autowired
	private JWTService jwtService;
	
	
	@Autowired
	private AuthenticationManager authenticationManager;
//-----------------------------------------------------------------------------------------
	

    

	@Autowired
	UserRepository urepo;
	

	@Autowired
	PasswordEncoder passworEncder;
	
	@Autowired
	ClubMemberRepository cmrepo;
	
	@Autowired
	RoleRepository rrepo;

	
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
	       
			//It Authenticate given username and password first here then generate token
			Authentication authentication= authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username,password));
			String token="";
		
			//It Authenticate given username and password first here then generate token	 
			if(authentication.isAuthenticated()) {
			 token=jwtService.GenerateToken(username);
			}else {
				throw new UsernameNotFoundException("Invalid user Request");
			}
	    	
	    	User user=urepo.findByEmail(username).get();
	        String pos=cmrepo.getPositon(user.getUid());
	        
	        
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

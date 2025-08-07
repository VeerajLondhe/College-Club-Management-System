package com.ccms.system.config;

import com.ccms.system.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository urepos;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        com.ccms.system.entities.User myUser = urepos.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        
        String roleName = "ROLE_" + myUser.getRole().getRname().toUpperCase();

        return new org.springframework.security.core.userdetails.User(
                myUser.getEmail(), 
                myUser.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(roleName))
        );
    }
}
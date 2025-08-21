package com.api.gateway.util;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.stereotype.Component;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JWTUtil {
	
	public static final String SECRET="b782c99b1ab95476dc739749793e1cf229cbbb907319fd1131938d50da875927";
	
	private Key getSignKey() {
		byte[] keyBytes=Decoders.BASE64.decode(SECRET);
		return Keys.hmacShaKeyFor(keyBytes);
	}
	
	//Here i VAlidate the token with SECRET Key which i have created
	public void vailidateToken(final String token) {
		Jwts.parser().setSigningKey(getSignKey()).build().parseClaimsJws(token);
	}

}

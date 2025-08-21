package com.api.gateway.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.api.gateway.util.JWTUtil;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {
	
	
	@Autowired
	private RouteValidator validator;
	
	@Autowired
	private RestTemplate template;
	
	@Autowired
	private JWTUtil jwtUtil;
	
	public AuthenticationFilter() {
		super(Config.class);
	}

	@Override
	public GatewayFilter apply(Config config) {
		// TODO Auto-generated method stub
		return ((exchange,chain)->{
			
			//it checks the requet is not part of Request validator which i have written 
			if(validator.isSecured.test(exchange.getRequest())) {
				//Header contains token or not 
				if(!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
					throw new RuntimeException("missing authorization header");
				}
				//It retrives the 0 th index autherization header from request
				String authheader=exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
				if(authheader!=null && authheader.startsWith("Bearer ")) {
					//IT removes the Bearer from token here we get the actual token
					authheader=authheader.substring(7);
				}
				try {
					 //Rest Call to AUTH service`
					//or
					jwtUtil.vailidateToken(authheader);
				}catch(Exception e) {
					System.out.println("Invalid access");
					throw new RuntimeException("Un authorized access to  application");
				}
				
			}
			
			return chain.filter(exchange);
		});
	}
	
	public static class Config{
		
	}
}

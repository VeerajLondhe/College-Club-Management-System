package com.api.gateway.filter;

import java.util.List;
import java.util.function.Predicate;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

//It IS ROute validetor 
@Component
public class RouteValidator {
	
	//This allow the all request start with given URL endpoint's Without validation of JWT token 
	 public static final List<String> openApiEndpoints = List.of(
			 	"/auth",
			 	"/role",
	            "/eureka"
	    );
	 
	 public Predicate<ServerHttpRequest> isSecured =
	            request -> openApiEndpoints
	                    .stream()
	                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
}

package com.ccms.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.ccms.system.*")
public class CollegeClubManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(CollegeClubManagementSystemApplication.class, args);
	}

}

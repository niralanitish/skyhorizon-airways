package com.skyhorizon.skyhorizon_airways;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;

@SpringBootApplication
@EnableRetry
public class SkyhorizonAirwaysApplication {

	public static void main(String[] args) {
		SpringApplication.run(SkyhorizonAirwaysApplication.class, args);
	}

}

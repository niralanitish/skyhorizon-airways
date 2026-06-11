package com.skyhorizon.skyhorizon_airways.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.skyhorizon.skyhorizon_airways.model.Flight;
import com.skyhorizon.skyhorizon_airways.model.FlightStatus;
import com.skyhorizon.skyhorizon_airways.repository.FlightRepository;

@Component
public class DataLoader implements CommandLineRunner {

    private final FlightRepository flightRepository;

    public DataLoader(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

   @Override
public void run(String... args) throws Exception {

    System.out.println("DataLoader Running...");

    Flight flight1 = new Flight();

    flight1.setFlightNumber("SH101");
    flight1.setSource("Hyderabad");
    flight1.setDestination("Delhi");
    flight1.setPrice(4500.0);
    flight1.setAvailableSeats(120);
    flight1.setNumberOfStops(0);
    flight1.setStatus(FlightStatus.SCHEDULED);

    if (!flightRepository.existsByFlightNumber(
        flight1.getFlightNumber())) {

    flightRepository.save(flight1);
    }

    System.out.println("Flight Saved Successfully");

}
}
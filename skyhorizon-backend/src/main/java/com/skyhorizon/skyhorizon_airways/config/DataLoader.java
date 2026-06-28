package com.skyhorizon.skyhorizon_airways.config;

import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.skyhorizon.skyhorizon_airways.model.Flight;
import com.skyhorizon.skyhorizon_airways.model.FlightStatus;
import com.skyhorizon.skyhorizon_airways.repository.FlightRepository;

@Component
public class DataLoader implements CommandLineRunner {

    private final FlightRepository flightRepository;

     private Flight createFlight(
        String flightNumber,
        String source,
        String destination,
        Double price,
        int seats,
        int stops,
        FlightStatus status) {

        Flight flight = new Flight();

        flight.setFlightNumber(flightNumber);
        flight.setSource(source);
        flight.setDestination(destination);
        flight.setPrice(price);
        flight.setAvailableSeats(seats);
        flight.setNumberOfStops(stops);
        flight.setStatus(status);

        return flight;
    }

    public DataLoader(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
        
        
    }

   @Override
public void run(String... args) throws Exception {

    System.out.println("DataLoader Running...");

        List<Flight> flights = List.of(
        createFlight("SH101","Hyderabad","Delhi",4500.0,120,0,FlightStatus.SCHEDULED),
        createFlight("SH102","Mumbai","Bangalore",3200.0,95,0,FlightStatus.ON_TIME),
        createFlight("SH103","Chennai","Hyderabad",2800.0,60,0,FlightStatus.SCHEDULED),
        createFlight("SH104","Delhi","Kolkata",5200.0,110,1,FlightStatus.DELAYED),
        createFlight("SH105","Bangalore","Pune",2500.0,80,0,FlightStatus.ON_TIME),
        createFlight("SH106","Hyderabad","Mumbai",3500.0,0,0,FlightStatus.SCHEDULED),
        createFlight("SH107","Kolkata","Chennai",4800.0,75,1,FlightStatus.CANCELLED),
        createFlight("SH108","Pune","Delhi",3900.0,90,0,FlightStatus.BOARDING),
        createFlight("SH109","Bangalore","Hyderabad",3000.0,65,0,FlightStatus.ON_TIME),
        createFlight("SH110","Delhi","Mumbai",5500.0,140,0,FlightStatus.SCHEDULED)
    );

    int savedCount = 0;

    for (Flight flight : flights) {

        if (!flightRepository.existsByFlightNumber(
            flight.getFlightNumber())) {

        flightRepository.save(flight);
        savedCount++;
        }
    }

    System.out.println(savedCount + " flights saved.");

    }
    
}
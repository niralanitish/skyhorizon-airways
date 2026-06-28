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

    // Domestic Flights
    createFlight("SH101","Hyderabad","Delhi",5499.0,45,0,FlightStatus.ON_TIME),
    createFlight("SH102","Delhi","Hyderabad",5299.0,38,0,FlightStatus.ON_TIME),
    createFlight("SH103","Mumbai","Bangalore",4899.0,52,0,FlightStatus.ON_TIME),
    createFlight("SH104","Bangalore","Mumbai",4799.0,41,0,FlightStatus.DELAYED),
    createFlight("SH105","Chennai","Hyderabad",3999.0,60,0,FlightStatus.ON_TIME),
    createFlight("SH106","Hyderabad","Goa",4299.0,35,0,FlightStatus.ON_TIME),
    createFlight("SH107","Goa","Hyderabad",4199.0,28,0,FlightStatus.BOARDING),
    createFlight("SH108","Delhi","Kolkata",5999.0,48,1,FlightStatus.ON_TIME),
    createFlight("SH109","Kolkata","Delhi",5899.0,36,1,FlightStatus.SCHEDULED),
    createFlight("SH110","Pune","Chennai",4599.0,30,0,FlightStatus.CANCELLED),
    createFlight("SH111","Ahmedabad","Goa",5199.0,40,0,FlightStatus.ON_TIME),
    createFlight("SH112","Jaipur","Bangalore",5799.0,25,1,FlightStatus.ON_TIME),
    createFlight("SH113","Lucknow","Mumbai",4999.0,50,0,FlightStatus.ON_TIME),
    createFlight("SH114","Mumbai","Chennai",4699.0,44,0,FlightStatus.SCHEDULED),
    createFlight("SH115","Hyderabad","Bangalore",2899.0,72,0,FlightStatus.ON_TIME),
    createFlight("SH116","Bangalore","Hyderabad",2999.0,68,0,FlightStatus.ON_TIME),
    createFlight("SH117","Delhi","Goa",6399.0,22,0,FlightStatus.DELAYED),
    createFlight("SH118","Goa","Delhi",6299.0,31,0,FlightStatus.ON_TIME),
    createFlight("SH119","Mumbai","Pune",1999.0,80,0,FlightStatus.BOARDING),
    createFlight("SH120","Pune","Mumbai",1999.0,75,0,FlightStatus.ON_TIME),

    // International Flights
    createFlight("SH201","Hyderabad","Dubai",18999.0,22,0,FlightStatus.ON_TIME),
    createFlight("SH202","Delhi","Singapore",24999.0,18,0,FlightStatus.ON_TIME),
    createFlight("SH203","Mumbai","London",59999.0,15,0,FlightStatus.SCHEDULED),
    createFlight("SH204","Bangalore","New York",82999.0,12,1,FlightStatus.DELAYED),
    createFlight("SH205","Chennai","Kuala Lumpur",21499.0,28,0,FlightStatus.ON_TIME)

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
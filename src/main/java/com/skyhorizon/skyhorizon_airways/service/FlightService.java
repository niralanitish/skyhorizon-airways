package com.skyhorizon.skyhorizon_airways.service;

import java.util.List;
import java.util.Optional;
import com.skyhorizon.skyhorizon_airways.model.Flight;
import org.springframework.stereotype.Service;
import com.skyhorizon.skyhorizon_airways.repository.FlightRepository;

@Service
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }
    public Optional<Flight> getFlightById(Long id) {
        return flightRepository.findById(id);
    }
    public List<Flight> searchFlights(
        String source,
        String destination) {

        return flightRepository.findBySourceAndDestination(
                    source,
                    destination);
    }

}
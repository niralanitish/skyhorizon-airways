package com.skyhorizon.skyhorizon_airways.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.skyhorizon.skyhorizon_airways.model.Flight;

public interface FlightRepository
        extends JpaRepository<Flight, Long> {
        boolean existsByFlightNumber(String flightNumber);
        List<Flight> findBySourceAndDestination(
        String source,
        String destination);

}
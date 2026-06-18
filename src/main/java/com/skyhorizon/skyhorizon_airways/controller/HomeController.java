package com.skyhorizon.skyhorizon_airways.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skyhorizon.skyhorizon_airways.model.Flight;
import com.skyhorizon.skyhorizon_airways.service.FlightService;

@RestController
public class HomeController {

    private final FlightService flightService;

    public HomeController(FlightService flightService) {
        this.flightService = flightService;
    }

    @GetMapping("/")
    public String home() {
        return "Welcome to SkyHorizon Airways";
    }

    @GetMapping("/flights")
    public List<Flight> getFlights() {
        return flightService.getAllFlights();
    }

    @GetMapping("/flights/{id}")
    public Optional<Flight> getFlightById(
        @PathVariable Long id) {
        return flightService.getFlightById(id);
    }

    @GetMapping("/flights/search/{source}/{destination}")
    public List<Flight> searchFlights(
        @PathVariable String source,
        @PathVariable String destination) {

        return flightService.searchFlights(
            source,
            destination);
    }
}
package com.skyhorizon.skyhorizon_airways.controller;

import java.util.List;

import com.skyhorizon.skyhorizon_airways.model.Flight;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to SkyHorizon Airways";
    }
    @GetMapping("/flights")
    public List<Flight> getFlights() {

        Flight flight1 =
            new Flight(
                    "SH101",
                    "Hyderabad",
                    "Delhi"
            );

        Flight flight2 =
            new Flight(
                    "SH102",
                    "Mumbai",
                    "Bangalore"
            );

        return List.of(flight1, flight2);
}
}
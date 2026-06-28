package com.skyhorizon.skyhorizon_airways.model;

import java.time.LocalDate;
import java.time.LocalTime;
import jakarta.persistence.Table;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String flightNumber;

    private String airline;

    private String source;

    private String destination;

    private LocalDate departureDate;

    private LocalTime departureTime;

    private LocalTime arrivalTime;

    private String duration;

    private String aircraft;

    private Double price;

    private Integer availableSeats;

    private Integer numberOfStops;

    private String terminal;

    private String gate;
  

private Double rating;

private Boolean wifi;

private Boolean meal;

private String refundType;
    @Enumerated(EnumType.STRING)
    private FlightStatus status;


    public Flight() {

    }
    public Flight(String flightNumber,
              String source,
              String destination) {

        this.flightNumber = flightNumber;
        this.source = source;
        this.destination = destination;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public Long getId() {
        return id;
    }

    public Double getPrice() {
        return price;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public int getNumberOfStops() {
        return numberOfStops;
    }

    public FlightStatus getStatus() {
        return status;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    public void setNumberOfStops(int numberOfStops) {
        this.numberOfStops = numberOfStops;
    }

    public void setStatus(FlightStatus status) {
        this.status = status;
    }
    
}
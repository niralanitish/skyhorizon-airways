package com.skyhorizon.skyhorizon_airways.dto;

public class FlightDTO {

    private Long id;
    private String flightNumber;
    private String airline;
    private String source;
    private String destination;
    private Double price;
    private Integer availableSeats;
    private Integer numberOfStops;
    private String status;

    public FlightDTO() {
    }

    public FlightDTO(Long id,
                     String flightNumber,
                     String airline,
                     String source,
                     String destination,
                     Double price,
                     Integer availableSeats,
                     Integer numberOfStops,
                     String status) {

        this.id = id;
        this.flightNumber = flightNumber;
        this.airline = airline;
        this.source = source;
        this.destination = destination;
        this.price = price;
        this.availableSeats = availableSeats;
        this.numberOfStops = numberOfStops;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public String getAirline() {
        return airline;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public Double getPrice() {
        return price;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public Integer getNumberOfStops() {
        return numberOfStops;
    }

    public String getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public void setAirline(String airline) {
        this.airline = airline;
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

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public void setNumberOfStops(Integer numberOfStops) {
        this.numberOfStops = numberOfStops;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
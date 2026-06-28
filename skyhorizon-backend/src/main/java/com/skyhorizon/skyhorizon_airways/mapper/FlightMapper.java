package com.skyhorizon.skyhorizon_airways.mapper;

import com.skyhorizon.skyhorizon_airways.dto.FlightDTO;
import com.skyhorizon.skyhorizon_airways.model.Flight;

public class FlightMapper {

    public static FlightDTO toDTO(Flight flight){

        FlightDTO dto = new FlightDTO();

        dto.setId(flight.getId());
        dto.setFlightNumber(flight.getFlightNumber());

        dto.setAirline("SkyHorizon Airways");

        dto.setSource(flight.getSource());

        dto.setDestination(flight.getDestination());

        dto.setPrice(flight.getPrice());

        dto.setAvailableSeats(flight.getAvailableSeats());

        dto.setNumberOfStops(flight.getNumberOfStops());

        dto.setStatus(flight.getStatus().name());

        return dto;

    }

}
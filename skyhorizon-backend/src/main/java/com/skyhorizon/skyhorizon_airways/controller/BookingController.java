package com.skyhorizon.skyhorizon_airways.controller;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.skyhorizon.skyhorizon_airways.dto.BookingRequest;
import com.skyhorizon.skyhorizon_airways.model.Booking;
import com.skyhorizon.skyhorizon_airways.service.BookingService;

@RestController
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Temporary endpoint for browser testing
    @GetMapping("/bookings")
    public Booking testBooking() {

        return bookingService.bookFlight(
                1L,
                "Nitish",
                2
        );
    }

    @GetMapping("/all-bookings")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }
    // Real API
    @PostMapping("/bookings")
    public Booking bookFlight(@RequestBody BookingRequest request) {

        return bookingService.bookFlight(
                request.getFlightId(),
                request.getPassengerName(),
                request.getNumberOfSeats()
        );
    }
}
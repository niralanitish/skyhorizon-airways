package com.skyhorizon.skyhorizon_airways.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.skyhorizon.skyhorizon_airways.dto.BookingRequest;
import com.skyhorizon.skyhorizon_airways.model.Booking;
import com.skyhorizon.skyhorizon_airways.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Create Booking
    @PostMapping
    public Booking bookFlight(@RequestBody BookingRequest request) {

        return bookingService.bookFlight(request);
    }

    // Get All Bookings
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // Get Booking By Id
    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    // Cancel Booking
    @DeleteMapping("/{id}")
    public String cancelBooking(@PathVariable Long id) {

        return bookingService.cancelBooking(id);

    }

    @GetMapping("/my")
public List<Booking> getMyBookings() {

    return bookingService.getMyBookings();

}
}
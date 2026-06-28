package com.skyhorizon.skyhorizon_airways.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.skyhorizon.skyhorizon_airways.model.User;
import com.skyhorizon.skyhorizon_airways.dto.BookingRequest;
import com.skyhorizon.skyhorizon_airways.model.Booking;
import com.skyhorizon.skyhorizon_airways.model.Flight;
import com.skyhorizon.skyhorizon_airways.repository.BookingRepository;
import com.skyhorizon.skyhorizon_airways.repository.FlightRepository;
import com.skyhorizon.skyhorizon_airways.repository.UserRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final UserRepository userRepository;
    public BookingService(
        BookingRepository bookingRepository,
        FlightRepository flightRepository,
        UserRepository userRepository) {

    this.bookingRepository = bookingRepository;
    this.flightRepository = flightRepository;
    this.userRepository = userRepository;
}

    public Booking bookFlight(BookingRequest request) {

        Optional<Flight> optionalFlight =
        flightRepository.findById(request.getFlightId());

        if (optionalFlight.isEmpty()) {
            return null;
        }

        Flight flight = optionalFlight.get();

        Authentication authentication =
        SecurityContextHolder
                .getContext()
                .getAuthentication();

String email = authentication.getName();

User user = userRepository
        .findByEmail(email)
        .orElseThrow();

        if (flight.getAvailableSeats() < request.getNumberOfSeats()) {
            return null;
        }

        // Reduce seats
        flight.setAvailableSeats(
        flight.getAvailableSeats() - request.getNumberOfSeats());

        flightRepository.save(flight);

        Booking booking = new Booking();

        
        booking.setBookingNumber(
                "SHB" + System.currentTimeMillis());

        booking.setPassengerName(request.getPassengerName());
            booking.setUser(user);
        booking.setNumberOfSeats(request.getNumberOfSeats());
        booking.setPassengerEmail(request.getPassengerEmail());

booking.setPassengerPhone(request.getPassengerPhone());

booking.setPassengerAge(request.getPassengerAge());

booking.setPassengerGender(request.getPassengerGender());

booking.setTravelClass(request.getTravelClass());
       booking.setTotalAmount(
        flight.getPrice() * request.getNumberOfSeats());

        booking.setBookingStatus("CONFIRMED");

        booking.setPaymentStatus("PENDING");

        booking.setFlight(flight);

        return bookingRepository.save(booking);
    }

    public String cancelBooking(Long bookingId) {

        Optional<Booking> optionalBooking =
                bookingRepository.findById(bookingId);

        if (optionalBooking.isEmpty()) {
            return "Booking not found";
        }

        Booking booking = optionalBooking.get();

        Flight flight = booking.getFlight();

        flight.setAvailableSeats(
                flight.getAvailableSeats()
                        + booking.getNumberOfSeats());

        flightRepository.save(flight);

        booking.setBookingStatus("CANCELLED");
        
        bookingRepository.save(booking);

        return "Booking Cancelled Successfully";
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {

        return bookingRepository.findById(id)
                .orElse(null);
    }

    public List<Booking> getMyBookings() {

    Authentication authentication =
            SecurityContextHolder
                    .getContext()
                    .getAuthentication();

    String email = authentication.getName();

    User user = userRepository
            .findByEmail(email)
            .orElseThrow();

    return bookingRepository.findByUser(user);

}
}
package com.skyhorizon.skyhorizon_airways.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import com.skyhorizon.skyhorizon_airways.model.Booking;
import com.skyhorizon.skyhorizon_airways.model.Flight;
import com.skyhorizon.skyhorizon_airways.repository.BookingRepository;
import com.skyhorizon.skyhorizon_airways.repository.FlightRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;

    public BookingService(
            BookingRepository bookingRepository,
            FlightRepository flightRepository) {

        this.bookingRepository = bookingRepository;
        this.flightRepository = flightRepository;
    }

   public Booking bookFlight(
        Long flightId,
        String passengerName,
        int numberOfSeats) {

    Optional<Flight> optionalFlight =
            flightRepository.findById(flightId);

    if (optionalFlight.isEmpty()) {
        return null;
    }

    Flight flight = optionalFlight.get();

    if (flight.getAvailableSeats() < numberOfSeats) {
        return null;
    }

    flight.setAvailableSeats(
            flight.getAvailableSeats()
            - numberOfSeats
    );

    flightRepository.save(flight);

    Booking booking = new Booking();

    String bookingNumber =
            "BK" + System.currentTimeMillis();

    booking.setBookingNumber(bookingNumber);
    booking.setPassengerName(passengerName);
    booking.setNumberOfSeats(numberOfSeats);
    booking.setFlight(flight);

    Booking savedBooking =
            bookingRepository.save(booking);

    return savedBooking;
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
            flight.getAvailableSeats() + booking.getNumberOfSeats()
        );
        flightRepository.save(flight);

        bookingRepository.delete(booking);

        return "Booking Cancelled Successfully";
    }

    public List<Booking> getAllBookings(){
        return bookingRepository.findAll();
    }
}
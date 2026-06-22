package com.skyhorizon.skyhorizon_airways.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skyhorizon.skyhorizon_airways.model.Booking;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

}
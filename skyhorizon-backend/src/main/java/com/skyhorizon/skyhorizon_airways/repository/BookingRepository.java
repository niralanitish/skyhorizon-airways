package com.skyhorizon.skyhorizon_airways.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skyhorizon.skyhorizon_airways.model.Booking;
import com.skyhorizon.skyhorizon_airways.model.User;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    List<Booking> findByUser(User user);

}
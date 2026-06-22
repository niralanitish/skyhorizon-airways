package com.skyhorizon.skyhorizon_airways.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skyhorizon.skyhorizon_airways.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

}
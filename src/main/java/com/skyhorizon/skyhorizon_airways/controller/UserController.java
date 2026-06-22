package com.skyhorizon.skyhorizon_airways.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.skyhorizon.skyhorizon_airways.dto.LoginRequest;
import com.skyhorizon.skyhorizon_airways.dto.LoginResponse;
import com.skyhorizon.skyhorizon_airways.dto.UserRegisterRequest;
import com.skyhorizon.skyhorizon_airways.model.User;
import com.skyhorizon.skyhorizon_airways.service.UserService;
import jakarta.validation.Valid;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User register(@Valid @RequestBody UserRegisterRequest request) {

        return userService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {

        return userService.login(request);
    }
}
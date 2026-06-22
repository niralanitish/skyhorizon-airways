package com.skyhorizon.skyhorizon_airways.service;

import java.util.Optional;
import com.skyhorizon.skyhorizon_airways.dto.LoginResponse;
import com.skyhorizon.skyhorizon_airways.security.JwtService;
import com.skyhorizon.skyhorizon_airways.dto.LoginRequest;
import com.skyhorizon.skyhorizon_airways.dto.UserRegisterRequest;
import com.skyhorizon.skyhorizon_airways.model.User;
import com.skyhorizon.skyhorizon_airways.model.UserRole;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.skyhorizon.skyhorizon_airways.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtService jwtService) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
}

    public User register(UserRegisterRequest request) {

    Optional<User> optionalUser =
            userRepository.findByEmail(request.getEmail());

    if (optionalUser.isPresent()) {
        return null;
    }

    User user = new User();

    user.setName(request.getName());

    user.setEmail(request.getEmail());

    user.setPassword(passwordEncoder.encode(request.getPassword()));

    user.setRole(UserRole.USER);

    return userRepository.save(user);
    }
    public LoginResponse login(LoginRequest request) {

    authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()));

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow();

    String token = jwtService.generateToken(user.getEmail());

    LoginResponse response = new LoginResponse();

    response.setToken(token);
    response.setEmail(user.getEmail());
    response.setRole(user.getRole().name());

    return response;
    }
    
}
package com.skyhorizon.skyhorizon_airways.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "SkyHorizon Airways Backend Running Successfully 🚀";
    }
}
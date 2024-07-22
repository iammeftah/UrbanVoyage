package com.example.urbanvoyagebackend.controllers;

import com.example.urbanvoyagebackend.entity.travel.Passenger;
import com.example.urbanvoyagebackend.service.travel.PassengerService;
import com.example.urbanvoyagebackend.service.users.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/passengers")
public class PassengerController {

    private final PassengerService passengerService;

    @Autowired
    public PassengerController(PassengerService passengerService , AuthService authService) {
        this.passengerService = passengerService;
    }

    @PostMapping
    public ResponseEntity<Passenger> createPassenger(@RequestBody Passenger passenger) {
        Passenger savedPassenger = passengerService.savePassenger(passenger , passenger.getEmail());
        System.out.println("Created passenger " + savedPassenger);
        return ResponseEntity.ok(savedPassenger);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Passenger> getPassenger(@PathVariable Long id) {
        Passenger passenger = passengerService.getPassengerById(id);
        if (passenger != null) {
            return ResponseEntity.ok(passenger);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Add more endpoints as needed
}
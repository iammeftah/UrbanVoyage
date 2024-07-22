package com.example.urbanvoyagebackend.controllers;

import com.example.urbanvoyagebackend.entity.travel.Passenger;
import com.example.urbanvoyagebackend.entity.users.User;
import com.example.urbanvoyagebackend.repository.users.UserRepository;
import com.example.urbanvoyagebackend.service.travel.PassengerService;
import com.example.urbanvoyagebackend.service.users.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/passengers")
public class PassengerController {

    private final PassengerService passengerService;
    private final UserRepository userRepository;

    @Autowired
    public PassengerController(PassengerService passengerService , AuthService authService, UserRepository userRepository) {
        this.passengerService = passengerService;
        this.userRepository = userRepository;
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


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Passenger>> getPassengersByUserId(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        List<Passenger> passengers = passengerService.getPassengersByUser(user.orElse(null));
        return ResponseEntity.ok(passengers);
    }

    // Add more endpoints as needed
}
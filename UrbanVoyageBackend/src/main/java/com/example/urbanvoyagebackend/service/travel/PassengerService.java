package com.example.urbanvoyagebackend.service.travel;

import com.example.urbanvoyagebackend.entity.travel.Passenger;
import com.example.urbanvoyagebackend.entity.users.User;
import com.example.urbanvoyagebackend.repository.travel.PassengerRepository;
import com.example.urbanvoyagebackend.service.users.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PassengerService {

    private final PassengerRepository passengerRepository;
    private final AuthService authService;

    @Autowired
    public PassengerService(PassengerRepository passengerRepository, AuthService authService) {
        this.passengerRepository = passengerRepository;
        this.authService = authService;
    }

    public Passenger savePassenger(Passenger passenger, String userEmail) {
        User currentUser = authService.getCurrentUser(userEmail);
        if (currentUser != null) {
            passenger.setCreatedByUser(currentUser);
        }
        System.out.println("PassengerService savePassenger: " + passenger);
        return passengerRepository.save(passenger);
    }

    public List<Passenger> getAllPassengers() {
        return passengerRepository.findAll();
    }

    public Passenger getPassengerById(Long id) {
        return passengerRepository.findById(id).orElse(null);
    }

    public List<Passenger> getPassengersByUser(User user) {
        return passengerRepository.findByCreatedByUser(user);
    }


}
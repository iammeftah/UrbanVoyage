package com.example.urbanvoyagebackend.service.travel;

import com.example.urbanvoyagebackend.entity.travel.Passenger;
import com.example.urbanvoyagebackend.entity.travel.Reservation;
import com.example.urbanvoyagebackend.entity.users.User;
import com.example.urbanvoyagebackend.repository.travel.PassengerRepository;
import com.example.urbanvoyagebackend.service.users.AuthService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PassengerService {

    private final PassengerRepository passengerRepository;
    private final AuthService authService;

    @Autowired
    public PassengerService(PassengerRepository passengerRepository, AuthService authService) {
        this.passengerRepository = passengerRepository;
        this.authService = authService;
    }

    @Transactional
    public Passenger savePassenger(Passenger passenger, String userEmail) {
        Optional<User> currentUser = authService.getCurrentUser(userEmail);
        if (currentUser.isPresent()) {
            passenger.setCreatedByUser(currentUser.orElse(null));
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

    public Passenger getPassengerByReservation(Reservation reservation) {
        return passengerRepository.findByReservation(reservation);
    }


}
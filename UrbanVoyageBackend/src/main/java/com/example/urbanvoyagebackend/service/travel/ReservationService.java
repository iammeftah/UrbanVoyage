package com.example.urbanvoyagebackend.service.travel;


import com.example.urbanvoyagebackend.enitity.travel.Reservation;
import com.example.urbanvoyagebackend.enitity.users.User;
import com.example.urbanvoyagebackend.repository.travel.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;

    public Reservation createReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getUserReservations(User user) {
        return reservationRepository.findByUser(user);
    }

    public boolean cancelReservation(Long reservationId) {
        reservationRepository.deleteById(reservationId);
        return true;
    }
}
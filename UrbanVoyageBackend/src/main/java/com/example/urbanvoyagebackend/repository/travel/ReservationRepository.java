package com.example.urbanvoyagebackend.repository.travel;


import com.example.urbanvoyagebackend.enitity.travel.Reservation;
import com.example.urbanvoyagebackend.enitity.users.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUser(User user);
}
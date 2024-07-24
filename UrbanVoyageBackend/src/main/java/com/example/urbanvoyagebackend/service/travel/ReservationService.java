package com.example.urbanvoyagebackend.service.travel;


import com.example.urbanvoyagebackend.dto.ReservationDTO;
import com.example.urbanvoyagebackend.entity.travel.Reservation;
import com.example.urbanvoyagebackend.entity.travel.Route;
import com.example.urbanvoyagebackend.entity.users.User;
import com.example.urbanvoyagebackend.repository.travel.ReservationRepository;
import com.example.urbanvoyagebackend.repository.travel.RouteRepository;
import com.example.urbanvoyagebackend.repository.users.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RouteRepository routeRepository;


    @Transactional
    public Reservation createReservation(ReservationDTO reservationDTO) {
        User user = userRepository.findById(reservationDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Route route = routeRepository.findById(reservationDTO.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setRoute(route);
        reservation.setReservationDate(new Date());
        reservation.setStatus(Reservation.ReservationStatus.PENDING);
        reservation.setSeatType(reservationDTO.getSeatType() != null ? reservationDTO.getSeatType() : Reservation.SeatType.STANDARD);



        System.out.println("ReservationService: Reservation created");

        return reservationRepository.save(reservation);
    }

    public Reservation updateReservationSeatType(Long id, String seatType) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        if (reservation == null) {
            throw new IllegalArgumentException("Reservation not found");
        }

        try {
            Reservation.SeatType newSeatType = Reservation.SeatType.valueOf(seatType.toUpperCase());
            reservation.setSeatType(newSeatType);
            return reservationRepository.save(reservation);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid seat type");
        }
    }

    public List<Reservation> getUserReservations(User user) {
        System.out.println("ReservationService: Reservertion found (" + user.getReservations() + ")");
        return reservationRepository.findByUser(user);
    }

    public boolean cancelReservation(Long reservationId) {
        reservationRepository.deleteById(reservationId);
        return true;
    }



    public List<Reservation> getAllReservations() {
        System.out.println("ReservationService: getAllReservations method called");
        List<Reservation> reservations = reservationRepository.findAll();
        System.out.println("ReservationService: Number of reservations found: " + reservations.size());
        return reservations;
    }

    @Transactional
    public Reservation updateReservationStatus(Long id, String newStatus) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        Reservation.ReservationStatus currentStatus = reservation.getStatus();
        Reservation.ReservationStatus updatedStatus = Reservation.ReservationStatus.valueOf(newStatus);

        switch (currentStatus) {
            case PENDING:
                if (updatedStatus != Reservation.ReservationStatus.CONFIRMED) {
                    throw new IllegalStateException("Pending reservations can only be confirmed.");
                }
                break;
            case CONFIRMED:
                if (updatedStatus != Reservation.ReservationStatus.CANCELLED) {
                    throw new IllegalStateException("Confirmed reservations can only be cancelled.");
                }
                break;
            case CANCELLED:
                throw new IllegalStateException("Cancelled reservations cannot be modified.");
            default:
                throw new IllegalStateException("Invalid current status.");
        }

        reservation.setStatus(updatedStatus);
        return reservationRepository.save(reservation);
    }

    public void deleteReservation(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new IllegalArgumentException("Reservation with id " + id + " not found");
        }
        reservationRepository.deleteById(id);
    }

    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id).orElse(null);
    }

}
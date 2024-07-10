package com.example.urbanvoyagebackend.enitity.travel;


import com.example.urbanvoyagebackend.enitity.users.User;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationID;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @Column(nullable = false)
    private Date reservationDate;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    // Constructors, getters, and setters

    public Reservation() {}

    public Reservation(User user, Route route, Date reservationDate) {
        this.user = user;
        this.route = route;
        this.reservationDate = reservationDate;
        this.status = ReservationStatus.PENDING;
    }

    // Getters and setters for all fields

    public boolean createReservation() {
        // Implement reservation creation logic
        return true;
    }

    public boolean cancelReservation() {
        // Implement reservation cancellation logic
        return true;
    }

    public enum ReservationStatus {
        PENDING, CONFIRMED, CANCELLED
    }


    public Long getReservationID() {
        return reservationID;
    }

    public void setReservationID(Long reservationID) {
        this.reservationID = reservationID;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        this.route = route;
    }

    public Date getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(Date reservationDate) {
        this.reservationDate = reservationDate;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }
}
package com.example.urbanvoyagebackend.dto;

import com.example.urbanvoyagebackend.entity.travel.Passenger;
import com.example.urbanvoyagebackend.entity.travel.Reservation;
import com.example.urbanvoyagebackend.entity.travel.Route;
import com.example.urbanvoyagebackend.entity.users.User;

import java.time.LocalDateTime;
import java.util.Date;

public class ReservationDTO {
    private Long reservationID;
    private Date reservationDate;
    private Reservation.ReservationStatus status;
    private Long userId;
    private User user;
    private Long routeId;
    private Route route;
    private String departure ;
    private String arrival;
    private Reservation.SeatType seatType;
    private Passenger passenger ;
    private Long scheduleId;
    private LocalDateTime departureTime;

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public ReservationDTO() {
    }

    public ReservationDTO(Long reservationID, Date reservationDate, Reservation.ReservationStatus status, Long userId, Long routeId , Reservation.SeatType seatType , Passenger passenger) {
        this.reservationID = reservationID;
        this.reservationDate = reservationDate;
        this.status = status;
        this.userId = userId;
        this.routeId = routeId;
        this.seatType = seatType;
        this.passenger = passenger;
    }

    public Long getReservationID() {
        return reservationID;
    }

    public void setReservationID(Long reservationID) {
        this.reservationID = reservationID;
    }

    public Date getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(Date reservationDate) {
        this.reservationDate = reservationDate;
    }

    public Reservation.ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(Reservation.ReservationStatus status) {
        this.status = status;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public String getDeparture() {
        return departure;
    }

    public void setDeparture(String departure) {
        this.departure = departure;
    }

    public String getArrival() {
        return arrival;
    }

    public void setArrival(String arrival) {
        this.arrival = arrival;
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

    public Reservation.SeatType getSeatType() {
        return seatType;
    }

    public void setSeatType(Reservation.SeatType seatType) {
        this.seatType = seatType;
    }

    public Passenger getPassenger() {
        return passenger;
    }

    public void setPassenger(Passenger passenger) {
        this.passenger = passenger;
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    // Getters and setters
}
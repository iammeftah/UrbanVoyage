package com.example.urbanvoyagebackend.dto;


import java.util.Date;

public class ScheduleDTO {
    private Long scheduleID;
    private Date departureTime;
    private Date arrivalTime;
    private RouteDTO route;
    private int availableSeats;

    // Getters and setters
    public Long getScheduleID() { return scheduleID; }
    public void setScheduleID(Long scheduleID) { this.scheduleID = scheduleID; }
    public Date getDepartureTime() { return departureTime; }
    public void setDepartureTime(Date departureTime) { this.departureTime = departureTime; }
    public Date getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(Date arrivalTime) { this.arrivalTime = arrivalTime; }
    public RouteDTO getRoute() { return route; }
    public void setRoute(RouteDTO route) { this.route = route; }
    public int getAvailableSeats() { return availableSeats;}
    public void setAvailableSeats(int availableSeats) {this.availableSeats=availableSeats;}
}
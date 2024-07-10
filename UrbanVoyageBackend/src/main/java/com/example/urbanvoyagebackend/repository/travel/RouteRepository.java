package com.example.urbanvoyagebackend.repository.travel;


import com.example.urbanvoyagebackend.enitity.travel.Route;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByDepartureCityAndArrivalCity(String departureCity, String arrivalCity);
}
package com.example.urbanvoyagebackend.service.travel;


import com.example.urbanvoyagebackend.enitity.travel.Route;
import com.example.urbanvoyagebackend.repository.travel.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {
    @Autowired
    private RouteRepository routeRepository;

    public Route addRoute(Route route) {
        return routeRepository.save(route);
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public List<Route> findRoutes(String departureCity, String arrivalCity) {
        return routeRepository.findByDepartureCityAndArrivalCity(departureCity, arrivalCity);
    }
}
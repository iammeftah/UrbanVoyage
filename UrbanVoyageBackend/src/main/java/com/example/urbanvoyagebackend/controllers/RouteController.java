package com.example.urbanvoyagebackend.controllers;

import com.example.urbanvoyagebackend.entity.travel.Route;
import com.example.urbanvoyagebackend.service.travel.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/routes")
public class RouteController {

    @Autowired
    private RouteService routeService;


    @GetMapping("/search")
    public List<Route> findByDepartureAndArrival(@RequestParam String departure, @RequestParam String arrival ) {
        List<Route> routes = routeService.findByDepartureAndArrivalCity(departure, arrival);
        System.out.println("Returning " + routes.size() + " routes");
        System.out.println("Routes: " + routes);
        return routes;
    }

    @GetMapping
    public List<Route> getAllRoutes() {
        List<Route> routes = routeService.getAllRoutes();
        System.out.println("Returning " + routes.size() + " routes");
        System.out.println("Routes: " + routes);
        return routes;
    }

    @PostMapping
    public Route addRoute(@RequestBody Route route) {
        System.out.println("Route added");
        return routeService.addRoute(route);
    }

    @PutMapping("/{id}")
    public Route updateRoute(@PathVariable Long id, @RequestBody Route route) {
        return routeService.updateRoute(id, route);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoute(@PathVariable Long id) {
        try {
            routeService.deleteRoute(id);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
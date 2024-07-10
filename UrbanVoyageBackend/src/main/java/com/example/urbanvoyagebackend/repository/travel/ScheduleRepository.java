package com.example.urbanvoyagebackend.repository.travel;


import com.example.urbanvoyagebackend.enitity.travel.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByRouteDepartureCityAndRouteArrivalCityAndDepartureTimeAfter(String departureCity, String arrivalCity, Date date);
}
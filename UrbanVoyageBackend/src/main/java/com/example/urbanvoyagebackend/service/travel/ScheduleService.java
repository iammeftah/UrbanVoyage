package com.example.urbanvoyagebackend.service.travel;


import com.example.urbanvoyagebackend.enitity.travel.Schedule;
import com.example.urbanvoyagebackend.repository.travel.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ScheduleService {
    @Autowired
    private ScheduleRepository scheduleRepository;

    public Schedule addSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public List<Schedule> findSchedules(String departureCity, String arrivalCity, Date date) {
        return scheduleRepository.findByRouteDepartureCityAndRouteArrivalCityAndDepartureTimeAfter(departureCity, arrivalCity, date);
    }
}
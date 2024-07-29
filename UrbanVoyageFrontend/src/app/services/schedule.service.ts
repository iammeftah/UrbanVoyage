import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Schedule } from "../models/schedule.model";
import {Route} from "../models/route.model";
import {DistanceService} from "./distance.service";
import {PricingService} from "./pricing.service";
import {locations} from "../data/locations.data";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = 'http://localhost:8080/api/schedules';

  constructor(private http: HttpClient,
              private distanceService: DistanceService,
              private pricingService: PricingService
  ) { }

  getSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(this.apiUrl).pipe(
      map(schedules => schedules.map(schedule => ({
        ...schedule,
        route: schedule.route || {}
      }))),
      catchError(this.handleError)
    );
  }

  getScheduleById(id: number): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getSchedulesByRouteId(routeId: number): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/route/${routeId}`).pipe(
      catchError(this.handleError)
    );
  }

  addSchedule(schedule: Omit<Schedule, 'scheduleID'>): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.apiUrl}`, schedule);
  }

  updateSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(`${this.apiUrl}/${schedule.scheduleID}`, schedule).pipe(
      catchError(this.handleError)
    );
  }

  deleteSchedule(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 400 && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  updateAvailableSeats(scheduleId: number, newAvailableSeats: number): Observable<Schedule> {
    return this.http.patch<Schedule>(`${this.apiUrl}/${scheduleId}/availableSeats`, { availableSeats: newAvailableSeats });
  }

  generateSchedulesForDay(route: Route, date: Date): Observable<Schedule[]> {
    const schedules: Schedule[] = [];
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    // Find departure and arrival locations
    const departureLocation = locations.find(loc => loc.name === route.departureCity);
    const arrivalLocation = locations.find(loc => loc.name === route.arrivalCity);

    if (!departureLocation || !arrivalLocation) {
      console.error('Departure or arrival location not found');
      return of([]);
    }

    // Calculate distance
    const distance = this.distanceService.calculateDistance(
      departureLocation.lat, departureLocation.lng,
      arrivalLocation.lat, arrivalLocation.lng
    );

    // Calculate duration in hours (assuming average speed of 80 km/h)
    const durationHours = distance / 80;
    const durationMinutes = Math.round(durationHours * 60);

    for (let i = 0; i < 24; i++) {
      const departureTime = new Date(startOfDay);
      departureTime.setHours(i);

      const arrivalTime = new Date(departureTime);
      arrivalTime.setMinutes(arrivalTime.getMinutes() + durationMinutes);

      const price = this.pricingService.calculateTicketPrice(distance);

      const schedule: Schedule = {
        scheduleID: Math.floor(Math.random() * 1000000), // Temporary ID as number
        route: route,
        departureTime: departureTime.toISOString(),
        arrivalTime: arrivalTime.toISOString(),
        availableSeats: 50, // Assuming 50 seats
        schedulePrice: price,
        duration: `${Math.floor(durationHours)}:${Math.round((durationHours % 1) * 60).toString().padStart(2, '0')}`,
        seatType: 'STANDARD' // Default seat type
      };

      schedules.push(schedule);
    }

    return of(schedules);
  }

  saveSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.apiUrl}`, schedule).pipe(
      catchError(this.handleError)
    );
  }

  deleteOtherSchedules(selectedSchedule: Schedule): Observable<any> {
    // In a real implementation, you'd send a request to the backend to delete other schedules
    // For now, we'll just simulate this operation
    console.log('Deleting other schedules except:', selectedSchedule);
    return of(null);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Schedule } from "../models/schedule.model";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = 'http://localhost:8080/api/schedules';

  constructor(private http: HttpClient) { }

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
}

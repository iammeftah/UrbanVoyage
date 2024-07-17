import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Reservation } from '../models/reservation.model';



@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) { }

  getReservations(): Observable<any[]> {
    console.log("ReservationService: getReservations method called");
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(reservations => {
        console.log("ReservationService: Received reservations:", JSON.stringify(reservations, null, 2));
        reservations.forEach(reservation => {
          console.log("Reservation:", reservation);
          console.log("User:", reservation.user);
          console.log("Route:", reservation.route);
        });
      }),
      catchError(error => {
        console.error("ReservationService: Error fetching reservations:", error);
        return throwError(() => new Error('Something went wrong; please try again later.'));
      })
    );
  }

  updateReservationStatus(reservationID: number, newStatus: string): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.apiUrl}/${reservationID}/status`, newStatus).pipe(
      catchError(error => {
        if (error.status === 409) {
          // Conflict - invalid status change
          return throwError(() => new Error(error.error));
        } else if (error.status === 400) {
          // Bad request - invalid status
          return throwError(() => new Error(error.error));
        }
        // Other errors
        console.error('Error updating reservation status:', error);
        return throwError(() => new Error('Failed to update reservation status'));
      })
    );
  }


}

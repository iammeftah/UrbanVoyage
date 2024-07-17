import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';



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

  updateReservationStatus(id: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status });
  }


}

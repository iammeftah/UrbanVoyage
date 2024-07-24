import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Passenger } from '../models/passenger.model';

@Injectable({
  providedIn: 'root'
})
export class PassengerService {
  private apiUrl = 'http://localhost:8080/api/passengers';

  constructor(private http: HttpClient) { }

  createPassenger(passenger: Passenger): Observable<Passenger> {
    return this.http.post<Passenger>(this.apiUrl, passenger);
  }


  getPassenger(id: number): Observable<Passenger> {
    return this.http.get<Passenger>(`${this.apiUrl}/${id}`);
  }

  updatePassenger(id: number, passenger: Passenger): Observable<Passenger> {
    return this.http.put<Passenger>(`${this.apiUrl}/${id}`, passenger);
  }

  // In passenger.service.ts
  getPassengersByUserId(userId: number): Observable<Passenger[]> {
    return this.http.get<Passenger[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Transform the data to ensure reservationId is populated correctly
  transformPassengerData(data: any[]): Passenger[] {
    return data.map(item => ({
      ...item,
      reservationId: item.reservation ? item.reservation.reservationID : null
    }));
  }

}

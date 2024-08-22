import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../environment";

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private baseUrl = environment.baseUrl ;
  private apiUrl = `${this.baseUrl}/api/destinations`;

  constructor(private http: HttpClient) { }

  createDestination(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  getDestinations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getDestinationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateDestination(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteDestination(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

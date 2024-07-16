import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Route } from "../models/route.model";

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private apiUrl = 'http://localhost:8080/api/routes';

  constructor(private http: HttpClient) { }

  getRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(this.apiUrl).pipe(
      tap(data => console.log('Raw response:', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }


  getRouteById(id: number): Observable<Route> {
    return this.http.get<Route>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addRoute(route: Route): Observable<Route> {
    return this.http.post<Route>(this.apiUrl, route).pipe(
      catchError(this.handleError)
    );
  }

  updateRoute(route: Route): Observable<Route> {
    return this.http.put<Route>(`${this.apiUrl}/${route.routeID}`, route).pipe(
      catchError(this.handleError)
    );
  }

  deleteRoute(id: number): Observable<any> {
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

  findByDepartureAndArrival(departure: string, arrival: string ): Observable<Route[]> {
    return this.http.get<Route[]>(`${this.apiUrl}/search`, {
      params: { departure, arrival }
    }).pipe(
      catchError(this.handleError)
    );
  }
}

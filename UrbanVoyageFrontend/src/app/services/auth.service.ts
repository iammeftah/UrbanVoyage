import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError(error => {
        console.error('Error during registration:', error);
        return throwError(error);
      })
    );
  }

  verifyEmail(email: string, verificationCode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, { email, verificationCode });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, { email, password })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
        }),
        catchError((error) => {
          console.error('Error during login:', error);
          throw error; // Re-throw the error to be handled by the caller
        })
      );
  }



  logout(): Observable<any> {
    localStorage.removeItem('token');
    return this.http.post(`${this.apiUrl}/signout`, {});
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  checkUserExists(email: string, phoneNumber: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/check-user`, { email, phoneNumber }).pipe(
      catchError(error => {
        console.error('Error checking user existence:', error);
        return throwError(error);
      })
    );
  }






}

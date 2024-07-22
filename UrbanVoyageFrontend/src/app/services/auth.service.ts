import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private isAdminSubject = new BehaviorSubject<boolean>(this.getStoredAdminStatus());

  private userRolesSubject = new BehaviorSubject<string[]>(this.getStoredRoles());

  constructor(private http: HttpClient) {}

  private getStoredAdminStatus(): boolean {
    return JSON.parse(localStorage.getItem('isAdmin') || 'false');
  }

  resetAdminStatus() {
    this.setAdminStatus(false);
  }

  setAdminStatus(isAdmin: boolean) {
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
    this.isAdminSubject.next(isAdmin);
  }

  getAdminStatus(): Observable<boolean> {
    return this.isAdminSubject.asObservable();
  }

  isAdmin(): boolean {
    return this.getStoredAdminStatus();
  }

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
    return this.http.post(`${this.apiUrl}/signin`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.setUserRoles(response.roles); // Assuming the backend sends roles in the response
        }
      }),
      catchError((error) => {
        console.error('Error during login:', error);
        return throwError(error);
      })
    );
  }

  setUserRoles(roles: string[]) {
    localStorage.setItem('userRoles', JSON.stringify(roles));
    this.userRolesSubject.next(roles);
  }

  getStoredRoles(): string[] {
    const storedRoles = localStorage.getItem('userRoles');
    return storedRoles ? JSON.parse(storedRoles) : [];
  }

  getUserRoles(): Observable<string[]> {
    return this.userRolesSubject.asObservable();
  }

  hasRole(role: string): Observable<boolean> {
    return this.getUserRoles().pipe(
      map(roles => roles.includes(role))
    );
  }

  logout(): Observable<any> {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoles');
    this.setAdminStatus(false);
    this.userRolesSubject.next([]);
    return this.http.post(`${this.apiUrl}/signout`, {});
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
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

  getCurrentUserEmail(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.sub;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }


  loadCurrentUser(): void {
    const email = this.getCurrentUserEmail();
    if (email) {
      this.getUserDetails(email).subscribe(
        user => this.currentUserSubject.next(user),
        error => console.error('Error loading user details:', error)
      );
    }
  }

  getCurrentUser(): Observable<any> {
    if (!this.currentUserSubject.getValue()) {
      this.loadCurrentUser();
    }
    return this.currentUserSubject.asObservable();
  }

  getCurrentUserId(): Observable<number | null> {
    const email = this.getCurrentUserEmail();
    if (email) {
      return this.getUserDetails(email).pipe(
        map(user => user ? user.userID : null),
        catchError(error => {
          console.error('Error getting user details:', error);
          return of(null);
        })
      );
    }
    return of(null);
  }

  getUserDetails(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-details?email=${email}`).pipe(
      catchError(error => {
        console.error('Error fetching user details:', error);
        return throwError(error);
      })
    );
  }



}

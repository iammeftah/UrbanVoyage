// src/app/services/oauth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OAuthService {
  private baseUrl = 'http://localhost:8080'; // Your Spring Boot backend URL

  constructor(private http: HttpClient) {}

  initiateGoogleLogin(): void {
    window.location.href = `${this.baseUrl}/oauth2/authorization/google`;
  }

  handleRedirect(token: string): Observable<any> {
    // Store the token in local storage
    localStorage.setItem('auth_token', token);

    // You can also make a request to your backend to get user details if needed
    return this.http.get(`${this.baseUrl}/api/user`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
}



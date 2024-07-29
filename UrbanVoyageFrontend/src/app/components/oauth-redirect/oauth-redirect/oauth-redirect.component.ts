// src/app/components/oauth-redirect/oauth-redirect.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {OAuthService} from "../../../services/oauth.service";
import {AuthService} from "../../../services/auth.service";
// In oauth-redirect.component.ts

@Component({
  selector: 'app-oauth-redirect',
  template: '<p>Processing login...</p>'
})
export class OAuthRedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}


  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      try {
        this.authService.handleOAuthLogin(token);
        // Navigate to home or dashboard
        this.router.navigate(['/']);
      } catch (error) {
        console.error('Error handling OAuth login:', error);
        // Handle error (e.g., show error message to user)
      }
    } else {
      console.error('No token found in redirect URL');
      // Handle error (e.g., show error message to user)
    }
  }
}

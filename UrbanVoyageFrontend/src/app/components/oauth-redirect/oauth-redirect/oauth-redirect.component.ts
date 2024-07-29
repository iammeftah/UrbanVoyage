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
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.handleOAuthLogin(token);
        this.router.navigate(['/']); // or your desired route
      } else {
        console.error('No token received');
        this.router.navigate(['/login']);
      }
    });
  }
}

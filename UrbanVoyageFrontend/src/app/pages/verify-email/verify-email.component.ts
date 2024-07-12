// verify-email.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  email!: string;
  verificationCode: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  verifyEmail() {
    if (this.verificationCode.length !== 6) {
      alert('Please enter a 6-digit verification code.');
      return;
    }

    this.authService.verifyEmail(this.email, this.verificationCode).subscribe(
      (response) => {
        alert('Email verified successfully!');
        this.router.navigate(['/login']);
      },
      (error) => {
        alert('Verification failed: ' + error.error);
      }
    );
  }
}

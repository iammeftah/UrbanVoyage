// register-page.component.ts
import { Component } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  password: string = '';
  confirmPassword: string = '';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  showVerification: boolean = false;

  message: string | null = null;
  messageType: 'success' | 'error' = 'success';

  constructor(private authService: AuthService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register(): void {
    this.message = null; // Reset message before validation

    if (!this.firstName) {
      this.message = 'First name is required';
      this.messageType = 'error';
      return;
    }

    if (!this.lastName) {
      this.message = 'Last name is required';
      this.messageType = 'error';
      return;
    }

    if (!this.email) {
      this.message = 'Email is required';
      this.messageType = 'error';
      return;
    }

    if (!this.phoneNumber) {
      this.message = 'Phone number is required';
      this.messageType = 'error';
      return;
    }

    if (!this.password) {
      this.message = 'Password is required';
      this.messageType = 'error';
      return;
    }

    if (!this.confirmPassword) {
      this.message = 'Confirm Password is required';
      this.messageType = 'error';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      this.messageType = 'error';
      return;
    }

    const user = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password
    };



    this.authService.register(user).subscribe(
      (response) => {
        this.message = 'Registration successful! Please check your email for the verification code.';
        this.messageType = 'success';
        this.showVerification = true;
      },
      (error) => {
        this.message = 'Registration failed: ' + error.error;
        this.messageType = 'error';
      }
    );
  }

  onVerificationComplete(): void {
    this.message = 'Email verified successfully!';
    this.messageType = 'success';
    // Redirect to login or dashboard here
  }
}

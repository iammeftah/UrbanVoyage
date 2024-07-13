// login-page.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  rememberMe: boolean = false;
  isLoggedIn: boolean = false;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    console.log('Attempting login with email:', this.email);
    console.log('Password entered:', this.password);

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Login successful:', response);
        this.message = 'Login successful!';
        this.messageType = 'success';
        this.isLoggedIn = true;
        this.router.navigate(['/routes']);
      },
      (error) => {
        console.error('Login failed:', error);
        this.message = 'Login failed: ' + (error.error?.message || 'Unknown error');
        this.messageType = 'error';
      }
    );
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.message = 'Logged out successfully!';
    this.messageType = 'success';
    this.router.navigate(['/login']);
  }

  forgotPassword(): void {
    this.message = 'Forgot password functionality not implemented yet.';
    this.messageType = 'error';
  }

  loginWithFacebook(): void {
    this.message = 'Facebook login not implemented yet.';
    this.messageType = 'error';
  }

  loginWithGoogle(): void {
    this.message = 'Google login not implemented yet.';
    this.messageType = 'error';
  }

  closeMessage(){
    this.message = null ;
  }
}

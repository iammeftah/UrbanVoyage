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

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    console.log('Attempting login with email:', this.email); // Log the email being used for login
    console.log('Password entered:', this.password); // Log the password entered

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Login successful:', response); // Log the successful response from the backend
        alert('Login successful!');
        this.isLoggedIn = true;
        this.router.navigate(['/routes']);
      },
      (error) => {
        console.error('Login failed:', error); // Log the error response from the backend
        alert('Login failed: ' + (error.error?.message || 'Unknown error'));
      }
    );
  }


  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    alert('Logged out successfully!');
    this.router.navigate(['/login']);
  }

  forgotPassword(): void {
    alert('Forgot password functionality not implemented yet.');
  }

  loginWithFacebook(): void {
    alert('Facebook login not implemented yet.');
  }

  loginWithGoogle(): void {
    alert('Google login not implemented yet.');
  }
}

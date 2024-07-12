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

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Login successful:', response);
        alert('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login failed:', error);
        alert('Login failed: ' + (error.error || 'Unknown error'));
      }
    );
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

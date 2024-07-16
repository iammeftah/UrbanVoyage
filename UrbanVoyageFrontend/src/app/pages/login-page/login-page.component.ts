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
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    // Reset message
    this.message = null;

    // Validate fields
    if (!this.email.trim()) {
      this.showMessage('Please enter your email address.', 'error');
      return;
    }

    if (!this.password.trim()) {
      this.showMessage('Please enter your password.', 'error');
      return;
    }

    // If validation passes, proceed with login
    this.loading = true;
    console.log('Attempting login with email:', this.email);

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Login successful:', response);

        console.log('User ID:', response.id);
        console.log('First Name:', response.firstName);
        console.log('Last Name:', response.lastName);
        console.log('Email:', response.email);
        console.log('Phone Number:', response.phoneNumber);
        console.log('Username:', response.username);
        console.log('Token:', response.token);

        // Convert roles array to a list for easier iteration
        const rolesList = response.roles;
        let isAdmin = rolesList.includes("ROLE_ADMIN");
        this.authService.setAdminStatus(isAdmin); // <---------- this one


        // Determine the redirection route based on the presence of "ROLE_ADMIN"
        let redirectTo = '/routes'; // Default route for non-admins
        if (isAdmin) {
          redirectTo = '/backoffice';
        }

        this.loading = false;
        this.showMessage('Login successful!', 'success');
        this.isLoggedIn = true;
        this.router.navigate([redirectTo]);
      },
      (error) => {
        this.loading = false;
        console.error('Login failed:', error);
        this.showMessage(error.error?.message || 'An error occurred during login. Please try again.', 'error');
      }
    );


  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.showMessage('Logged out successfully!', 'success');
    
    this.router.navigate(['/login']);

  }

  forgotPassword(): void {
    this.showMessage('Forgot password functionality not implemented yet.', 'error');
  }

  loginWithFacebook(): void {
    this.showMessage('Facebook login not implemented yet.', 'error');
  }

  loginWithGoogle(): void {
    this.showMessage('Google login not implemented yet.', 'error');
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    // Optionally, you can set a timer to clear the message after a few seconds
    setTimeout(() => this.closeMessage(), 5000); // Clear message after 5 seconds
  }

  closeMessage(): void {
    this.message = null;
  }
}

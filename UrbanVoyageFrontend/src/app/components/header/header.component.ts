import { Component, Input } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isSidebarOpen: boolean = false;
  isLoggedIn: boolean = false;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';

  isAdmin: boolean = false;
  private adminSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.adminSubscription = this.authService.getAdminStatus().subscribe(
      isAdmin => {
        this.isAdmin = isAdmin;
      }
    );
  }

  ngOnDestroy() {
    if (this.adminSubscription) {
      this.adminSubscription.unsubscribe();
    }
  }



  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.message = "Log out successfuly"
    this.messageType = 'success';

    this.router.navigate(['/login']);
  }

  closeMessage(){
    this.message = null ;
  }

  closelogout(){
    this.closeSidebar();
    this.logout();
  }

}

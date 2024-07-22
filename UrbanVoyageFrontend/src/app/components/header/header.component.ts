import {Component, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
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
  isClient: boolean = false;
  private clientSubscription: Subscription | undefined;
  private adminSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.authService.getAdminStatus().subscribe(status => {
      this.isAdmin = status;
    });
    this.clientSubscription = this.authService.hasRole('ROLE_CLIENT').subscribe(
      isClient => this.isClient = isClient
    );
  }

  ngOnDestroy() {
    if (this.clientSubscription) {
      this.clientSubscription.unsubscribe();
    }
    // ... unsubscribe from other subscriptions if any ...
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

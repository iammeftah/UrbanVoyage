import {Component, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {filter, Subscription, switchMap} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  isSidebarOpen: boolean = false;
  isLoggedIn: boolean = false;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';

  private subscriptions: Subscription = new Subscription();

  isAdmin: boolean = false;
  isClient: boolean = false;
  private clientSubscription: Subscription | undefined;
  private adminSubscription: Subscription | undefined;


  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }



  ngOnInit() {
    this.subscriptions.add(
      this.authService.getUserRoles().subscribe(
        roles => {
          console.log('Roles updated in HeaderComponent:', roles);
          this.isClient = roles.includes('ROLE_CLIENT');
          this.isAdmin = roles.includes('ROLE_ADMIN');
          console.log('Is client:', this.isClient);
          console.log('Is admin:', this.isAdmin);
        }
      )
    );
  }




  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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


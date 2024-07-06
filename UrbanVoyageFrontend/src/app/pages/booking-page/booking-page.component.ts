import { Component } from '@angular/core';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent {
  isDropdownOpen: boolean = false;
  seatTypes: string[] = ['Standard Seat', 'Premium Seat', 'VIP Seat'];

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}

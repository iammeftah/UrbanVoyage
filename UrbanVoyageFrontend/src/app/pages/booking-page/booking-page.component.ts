import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Schedule } from 'src/app/models/schedule.model';
import { SharedDataService } from 'src/app/services/shared-data.service';
import {ReservationService} from "../../services/reservation.service";
import {AuthService} from "../../services/auth.service";
import {of, switchMap, tap} from "rxjs";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit {
  seatTypes: string[] = ['Standard Seat', 'Premium Seat', 'VIP Seat'];
  selectedSeatTypeIndex: number | null = null;

  selectedSchedule: Schedule | null = null;
  bookingUser: User | null = null;

  passengerInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  };

  paymentInfo = {
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };


  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.selectedSchedule = this.sharedDataService.getSelectedSchedule();
    this.bookingUser = this.sharedDataService.getBookingUser();

    if (!this.selectedSchedule) {
      console.log('No schedule selected, redirecting to routes page');
      this.router.navigate(['/routes']);
    }
  }


  calculateDuration(): string {
    if (!this.selectedSchedule) return '';

    const departure = new Date(this.selectedSchedule.departureTime);
    const arrival = new Date(this.selectedSchedule.arrivalTime);
    const durationMs = arrival.getTime() - departure.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }

  ngOnDestroy() {
    // Clear the selected schedule when leaving the booking page
    this.sharedDataService.clearSelectedSchedule();
  }

  selectSeatType(index: number): void {
    this.selectedSeatTypeIndex = index;
  }

  getSeatTypeButtonClass(index: number): string {
    const baseClasses = 'w-full flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none ';
    const activeClasses = 'w-full bg-cyan-600 text-white hover:bg-cyan-700 ';
    const inactiveClasses = 'w-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600';

    return `${baseClasses} ${this.selectedSeatTypeIndex === index ? activeClasses : inactiveClasses}`;
  }

  formatTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatDuration(duration: string): string {
    const [hours, minutes] = duration.split(':');
    return `${hours}h ${minutes}m`;
  }




  proceedToPayment() {
    console.log("Proceed to payment")
  }





}

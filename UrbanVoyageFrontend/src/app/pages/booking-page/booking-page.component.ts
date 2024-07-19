import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Schedule } from 'src/app/models/schedule.model';
import { SharedDataService } from 'src/app/services/shared-data.service';
import {ReservationService} from "../../services/reservation.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user.model";
import {Reservation} from "../../models/reservation.model";

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit {
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

  selectedReservation: Reservation | null = null;
  seatTypes = ['STANDARD', 'PREMIUM', 'VIP'];
  isLoading: boolean = false;


  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private reservationService: ReservationService,
    private authService: AuthService

  ) {}

  ngOnInit() {
    this.selectedSchedule = this.sharedDataService.getSelectedSchedule();
    this.selectedReservation = this.sharedDataService.getSelectedReservation();

    if (!this.selectedSchedule || !this.selectedReservation) {
      console.log('No schedule or reservation selected, redirecting to routes page');
      this.router.navigate(['/routes']);
    } else {
      console.log('Selected Reservation:', this.selectedReservation);

      // Initialize seatType to 'STANDARD' if not set
      if (!this.selectedReservation.seatType) {
        this.selectedReservation.seatType = 'STANDARD';
        // Optionally update the reservation on the server
        this.updateSeatType('STANDARD');
      }

      // Set the initial seat type index based on the reservation's seat type
      this.selectedSeatTypeIndex = this.seatTypes.indexOf(this.selectedReservation.seatType);
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
    // Clear the selected schedule and reservation when leaving the booking page
    this.sharedDataService.clearSelectedSchedule();
    this.sharedDataService.clearSelectedReservation();
  }

  selectSeatType(index: number): void {
    this.selectedSeatTypeIndex = index;
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


  updateSeatType(seatType: string) {
    this.isLoading = true ;
    if (!this.selectedReservation) {
      console.error('No reservation selected');
      return;
    }

    this.reservationService.updateReservationSeatType(this.selectedReservation.reservationID, seatType)
      .subscribe({
        next: (updatedReservation) => {
          this.isLoading = false ;
          console.log('Seat type updated successfully:', updatedReservation);
          this.selectedReservation = updatedReservation;
          //this.updateTotalPrice();
        },
        error: (error) => {
          this.isLoading = false ;
          console.error('Error updating seat type:', error);
          // Handle the error (e.g., show an error message to the user)
        }
      });
  }

  updateTotalPrice() {
    // Implement logic to update the total price based on the selected seat type
  }

  setSelectedReservation(reservation: Reservation) {
    this.selectedReservation = reservation;
  }

  getSeatTypeButtonClass(index: number): string {
    const baseClasses = 'w-full flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none ';
    const activeClasses = 'bg-cyan-500 text-white hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 ';
    const inactiveClasses = 'bg-gray-400 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-400 text-white dark:text-white ';

    return `${baseClasses} ${this.selectedReservation?.seatType === this.seatTypes[index] ? activeClasses : inactiveClasses}`;
  }



}

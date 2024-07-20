import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Schedule } from 'src/app/models/schedule.model';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ReservationService } from "../../services/reservation.service";
import { AuthService } from "../../services/auth.service";
import { User } from "../../models/user.model";
import { Reservation } from "../../models/reservation.model";
import { PassengerService } from "../../services/passenger.service";
import { Passenger } from "../../models/passenger.model";
import {PricingService} from "../../services/pricing.service";
import {DistanceService} from "../../services/distance.service";

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit {
  selectedSeatTypeIndex: number | null = null;
  selectedSchedule: Schedule | null = null;
  selectedReservation: Reservation | null = null;
  currentUser: User | null = null;

  passenger: Passenger = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    specialRequests: '',
    departureCity: '',
    arrivalCity: '',
    departureTime: '',
    arrivalTime: '',
    seatType: 'STANDARD',
    schedulePrice: 0
  };

  seatTypes = ['STANDARD', 'PREMIUM', 'VIP'];
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private reservationService: ReservationService,
    private authService: AuthService,
    private passengerService: PassengerService,
    private pricingService: PricingService,
    private distanceService: DistanceService
  ) {}


  ngOnInit() {
    this.selectedSchedule = this.sharedDataService.getSelectedSchedule();
    this.selectedReservation = this.sharedDataService.getSelectedReservation();

    if (!this.selectedSchedule || !this.selectedReservation) {
      console.log('No schedule or reservation selected, redirecting to routes page');
      this.router.navigate(['/routes']);
      return;
    }

    this.authService.getCurrentUser().subscribe(
      (user: User) => {
        this.currentUser = user;
        this.initializePassenger();
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }

  initializePassenger() {
    if (this.currentUser) {
      this.passenger.firstName = this.currentUser.firstName || '';
      this.passenger.lastName = this.currentUser.lastName || '';
      this.passenger.email = this.currentUser.email || '';
    }

    if (this.selectedSchedule) {
      this.passenger.departureCity = this.selectedSchedule.route.departureCity || '';
      this.passenger.arrivalCity = this.selectedSchedule.route.arrivalCity || '';
      this.passenger.departureTime = this.selectedSchedule.departureTime || '';
      this.passenger.arrivalTime = this.selectedSchedule.arrivalTime || '';
      this.passenger.schedulePrice = this.selectedSchedule.schedulePrice ;

      // If schedulePrice is still 0, set a default value
      if (this.passenger.schedulePrice === 0) {
        this.passenger.schedulePrice = 22.00;  // Or any other appropriate default value
      }
    }

    if (this.selectedReservation) {
      this.passenger.seatType = this.selectedReservation.seatType || 'STANDARD';
    }

    // Initialize other fields with default values
    this.passenger.phoneNumber = '';
    this.passenger.specialRequests = '';
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
    console.log("Proceed to payment");
  }

  updateSeatType(seatType: string) {
    this.isLoading = true;
    if (!this.selectedReservation) {
      console.error('No reservation selected');
      return;
    }

    this.reservationService.updateReservationSeatType(this.selectedReservation.reservationID, seatType)
      .subscribe({
        next: (updatedReservation) => {
          this.isLoading = false;
          console.log('Seat type updated successfully:', updatedReservation);
          this.selectedReservation = updatedReservation;
          this.passenger.seatType = updatedReservation.seatType;

        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating seat type:', error);
        }
      });
  }

  getSeatTypeButtonClass(index: number): string {
    const baseClasses = 'w-full flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none ';
    const activeClasses = 'bg-cyan-500 text-white hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 ';
    const inactiveClasses = 'bg-gray-400 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-400 text-white dark:text-white ';

    return `${baseClasses} ${this.passenger.seatType === this.seatTypes[index] ? activeClasses : inactiveClasses}`;
  }

  onSubmit() {
    console.log('Submitting passenger:', JSON.stringify(this.passenger, null, 2));
    if (!this.validatePassengerInfo()) {
      console.error('Invalid passenger information');
      // Optionally, you can show an error message to the user here
      return;
    }

    this.passengerService.createPassenger(this.passenger).subscribe(
      (createdPassenger) => {
        console.log('Passenger created:', createdPassenger);
        this.proceedToPayment();
      },
      (error) => {
        console.error('Error creating passenger:', error);
        // Optionally, you can show an error message to the user here
      }
    );
  }

  validatePassengerInfo(): boolean {
    console.log('Validating passenger information:');
    console.log('First Name:', this.passenger.firstName);
    console.log('Last Name:', this.passenger.lastName);
    console.log('Email:', this.passenger.email);
    console.log('Phone Number:', this.passenger.phoneNumber);
    console.log('Special Requests:', this.passenger.specialRequests);
    console.log('Departure City:', this.passenger.departureCity);
    console.log('Arrival City:', this.passenger.arrivalCity);
    console.log('Departure Time:', this.passenger.departureTime);
    console.log('Arrival Time:', this.passenger.arrivalTime);
    console.log('Seat Type:', this.passenger.seatType);
    console.log('Schedule Price:', this.passenger.schedulePrice);

    const isValid = !!(
      this.passenger.firstName &&
      this.passenger.lastName &&
      this.passenger.email &&
      this.passenger.phoneNumber &&
      this.passenger.departureCity &&
      this.passenger.arrivalCity &&
      this.passenger.departureTime &&
      this.passenger.arrivalTime &&
      this.passenger.seatType &&
      this.passenger.schedulePrice > 0  // Change this condition
    );

    console.log('Is passenger information valid:', isValid);

    return isValid;
  }





}

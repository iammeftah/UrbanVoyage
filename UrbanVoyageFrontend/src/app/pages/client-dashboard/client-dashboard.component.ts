import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { PassengerService } from '../../services/passenger.service';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { Passenger } from '../../models/passenger.model';
import { Reservation } from '../../models/reservation.model';
import {SharedDataService} from "../../services/shared-data.service";

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
  passengerTickets: Passenger[] = [];
  showChangeScheduleModal: boolean = false;
  selectedTicket: Passenger | null = null;
  newScheduleDate: string = '';
  loading: boolean = false;

  selectedPassenger: Passenger | null = null;


  showDatePicker = false;
  currentMonth: Date = new Date();
  calendarDays: number[] = [];
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


  constructor(
    private passengerService: PassengerService,
    private reservationService: ReservationService,
    private authService: AuthService,
    private sharedDataService: SharedDataService,
    private cdr: ChangeDetectorRef  // Add this

  ) {}

  ngOnInit() {
    this.selectedPassenger = this.sharedDataService.getSelectedPassenger();

    this.loadPassengerTickets();
    this.generateCalendar();
  }

  loadPassengerTickets() {
    this.loading = true;
    this.authService.getCurrentUserId().subscribe(userId => {
      if (userId) {
        this.passengerService.getPassengersByUserId(userId).subscribe(
          tickets => {
            this.loading = false;
            this.passengerTickets = this.passengerService.transformPassengerData(tickets);
            console.log('Loaded passenger tickets:', this.passengerTickets);
            this.cdr.detectChanges();
          },
          error => {
            this.loading = false;
            console.error('Error fetching passenger tickets:', error);
            this.cdr.detectChanges();
          }
        );
      }
    });
  }

  // Add this helper method to check if the status is valid
  private isValidStatus(status: string): status is Passenger['status'] {
    return ['PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED'].includes(status);
  }

  openChangeScheduleModal(ticket: Passenger) {
    this.selectedTicket = ticket;
    this.newScheduleDate = ticket.departureTime;
    this.showChangeScheduleModal = true;
  }

  closeChangeScheduleModal() {
    this.showChangeScheduleModal = false;
    this.selectedTicket = null;
    this.newScheduleDate = '';
  }

  changeSchedule() {
    if (this.selectedTicket && this.newScheduleDate) {
      this.reservationService.updateReservationSchedule(this.selectedTicket.reservationId, this.newScheduleDate).subscribe(
        updatedReservation => {
          console.log('Schedule updated:', updatedReservation);
          this.loadPassengerTickets(); // Reload tickets after update
          this.closeChangeScheduleModal();
        },
        error => {
          console.error('Error updating schedule:', error);
        }
      );
    }
  }

  requestRefund(ticket: Passenger) {
    console.log('Before refund request:', ticket.status);
    if (ticket.status === 'REFUNDED' || ticket.status === 'CANCELLED') {
      alert('This ticket has already been refunded or cancelled.');
      return;
    }

    if (ticket.reservationId) {
      if (confirm('Are you sure you want to request a refund for this ticket?')) {
        this.reservationService.requestRefund(ticket.reservationId).subscribe(
          result => {
            console.log('Refund response:', result);
            ticket.status = 'REFUNDED';
            console.log('After status update:', ticket.status);
            alert('Refund request processed successfully.');
            this.cdr.detectChanges();
          },
          error => {
            console.error('Error requesting refund:', error);
            alert('Failed to process refund request. Please try again later.');
          }
        );
      }
    } else {
      console.error('Cannot request refund: reservationId is missing for ticket', ticket);
      alert('Unable to process refund request. Please contact customer support.');
    }
  }






  openDatePicker(ticket: any) {
    this.showDatePicker = true;
    this.selectedTicket = ticket;
    this.currentMonth = new Date(ticket.departureTime);
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push(0);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push(i);
    }
  }

  prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }

  selectDate(day: number, ticket: any) {
    const newDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
    ticket.departureTime = newDate;
    this.showDatePicker = false;
    // Here you would typically call a service to update the ticket's date
    console.log(`Updated ticket ${ticket.id} to new date: ${newDate}`);
  }

  isSelectedDate(day: number): boolean {
    if (!this.selectedTicket) return false;
    const ticketDate = new Date(this.selectedTicket.departureTime);
    return (
      day === ticketDate.getDate() &&
      this.currentMonth.getMonth() === ticketDate.getMonth() &&
      this.currentMonth.getFullYear() === ticketDate.getFullYear()
    );
  }

  isCurrentMonth(day: number): boolean {
    const today = new Date();
    return (
      this.currentMonth.getMonth() === today.getMonth() &&
      this.currentMonth.getFullYear() === today.getFullYear() &&
      day >= today.getDate()
    );
  }
}

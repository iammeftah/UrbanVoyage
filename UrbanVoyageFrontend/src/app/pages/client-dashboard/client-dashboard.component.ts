import { Component, OnInit } from '@angular/core';
import { PassengerService } from '../../services/passenger.service';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { Passenger } from '../../models/passenger.model';
import { Reservation } from '../../models/reservation.model';

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

  constructor(
    private passengerService: PassengerService,
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPassengerTickets();
  }

  loadPassengerTickets() {
    this.authService.getCurrentUserId().subscribe(userId => {
      if (userId) {
        this.passengerService.getPassengersByUserId(userId).subscribe(
          tickets => {
            this.passengerTickets = tickets;
          },
          error => {
            console.error('Error fetching passenger tickets:', error);
          }
        );
      }
    });
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
    if (confirm('Are you sure you want to request a refund for this ticket?')) {
      this.reservationService.requestRefund(ticket.reservationId).subscribe(
        result => {
          console.log('Refund requested:', result);
          this.loadPassengerTickets(); // Reload tickets after refund request
        },
        error => {
          console.error('Error requesting refund:', error);
        }
      );
    }
  }
}

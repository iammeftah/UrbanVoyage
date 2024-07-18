import { Component, OnInit } from '@angular/core';
import {forkJoin, of, switchMap, tap} from 'rxjs';
import { Schedule } from 'src/app/models/schedule.model';
import { Route } from 'src/app/models/route.model';
import { RouteService } from 'src/app/services/route.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';
import {AuthService} from "../../services/auth.service";
import {ReservationService} from "../../services/reservation.service";


interface AgencyLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-routes-page',
  templateUrl: './routes-page.component.html',
  styleUrls: ['./routes-page.component.css']
})



export class RoutesPageComponent implements OnInit {
  isOneWay: boolean = true;
  travelingWithPet: boolean = false;
  departureCity: string = '';
  arrivalCity: string = '';

  schedules: Schedule[] = [];
  noRoutesFound: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  searchPerformed: boolean = false;

  message:string | null = null ;
  messageType: 'success' | 'error' = 'success';

  loading: boolean = false;



  locations: AgencyLocation[] = [
    { name: 'Casablanca', address: '123 Avenue Mohammed V, Casablanca', lat: 33.5731, lng: -7.5898 },
    { name: 'Rabat', address: '456 Avenue Mohamed V, Rabat', lat: 34.020882, lng: -6.841650 },
    { name: 'Marrakech', address: '789 Rue Yves Saint Laurent, Marrakech', lat: 31.6306, lng: -7.9922 },
    { name: 'Fes', address: '321 Place R\'cif, Fes', lat: 34.0339, lng: -5.0003 },
    { name: 'Tangier', address: '567 Place du 9 Avril 1947, Tangier', lat: 35.7721, lng: -5.8099 },
    { name: 'Agadir', address: '890 Avenue du Prince Moulay Abdallah, Agadir', lat: 30.4210, lng: -9.5831 },
    { name: 'Meknes', address: '234 Avenue des F.A.R., Meknes', lat: 33.8935, lng: -5.5364 },
    { name: 'Oujda', address: '543 Avenue Mohammed V, Oujda', lat: 34.6819, lng: -1.9086 },
    { name: 'Chefchaouen', address: '876 Place Outa el Hammam, Chefchaouen', lat: 35.1688, lng: -5.2688 },
    { name: 'Essaouira', address: '109 Avenue de l\'Istiqlal, Essaouira', lat: 31.5085, lng: -9.7595 },
    { name: 'Tetouan', address: '123 Avenue Moulay El Abbas, Tetouan', lat: 35.5770, lng: -5.3684 },
    { name: 'Nador', address: '456 Rue Ibn Rochd, Nador', lat: 35.1686, lng: -2.9335 },
    { name: 'El Jadida', address: '789 Boulevard Mohammed VI, El Jadida', lat: 33.2540, lng: -8.5060 },
    { name: 'Kenitra', address: '321 Avenue Mohamed Diouri, Kenitra', lat: 34.2610, lng: -6.5802 },
    { name: 'Safi', address: '567 Rue Oued Cherrat, Safi', lat: 32.2994, lng: -9.2372 },
    { name: 'Beni Mellal', address: '890 Avenue Hassan II, Beni Mellal', lat: 32.3372, lng: -6.3498 },
    { name: 'Laayoune', address: '234 Boulevard Mekka, Laayoune', lat: 27.1253, lng: -13.1625 },
    { name: 'Dakhla', address: '543 Rue de la Dakhla, Dakhla', lat: 23.6847, lng: -15.9563 },
    { name: 'Al Hoceima', address: '876 Rue Mohamed Zerktouni, Al Hoceima', lat: 35.2517, lng: -3.9372 },
    { name: 'Taroudant', address: '109 Avenue Moulay Ismail, Taroudant', lat: 30.4700, lng: -8.8760 },
    { name: 'Guelmim', address: '123 Avenue des F.A.R., Guelmim', lat: 28.9864, lng: -10.0571 },
    { name: 'Sidi Ifni', address: '456 Rue de la Plage, Sidi Ifni', lat: 29.3808, lng: -10.1723 },
    { name: 'Zagora', address: '789 Rue des Oasis, Zagora', lat: 30.3473, lng: -5.8393 },
    { name: 'Taza', address: '321 Avenue Allal Al Fassi, Taza', lat: 34.2086, lng: -3.9733 },
    { name: 'Errachidia', address: '567 Rue Moulay Ali Cherif, Errachidia', lat: 31.9315, lng: -4.4247 }
  ];

  selectedSchedule: Schedule | null = null;


  constructor(
    private routeService: RouteService,
    private scheduleService: ScheduleService,
    private reservationService: ReservationService,
    private router: Router,
    private sharedDataService: SharedDataService,
    private authService: AuthService
  ) {}


  ngOnInit() {
    this.selectedSchedule = this.sharedDataService.getSelectedSchedule();
    this.generateCalendar();
  }

  searchRoutes(): void {
    this.loading = true;
    this.errorMessage = '';
    this.noRoutesFound = false;
    this.schedules = [];
    this.searchPerformed = true;

    console.log('Searching for routes:', this.departureCity, this.arrivalCity, this.travelDate);

    this.routeService.findByDepartureAndArrival(this.departureCity, this.arrivalCity).subscribe({
      next: (routes) => {
        console.log('Routes found:', routes);
        if (routes.length === 0) {
          this.noRoutesFound = true;
          this.loading = false;
        } else {
          this.loadSchedulesForRoutes(routes);
        }
      },
      error: (error) => {
        console.error('Error fetching routes:', error);
        this.handleError(error);
      }
    });
  }

  private loadSchedulesForRoutes(routes: Route[]): void {
    const scheduleObservables = routes.map(route =>
      this.scheduleService.getSchedulesByRouteId(route.routeID)
    );

    forkJoin(scheduleObservables).subscribe({
      next: (scheduleArrays) => {
        console.log('All schedules:', scheduleArrays);
        this.schedules = scheduleArrays.flat().filter(schedule =>
          this.isSameDay(new Date(schedule.departureTime), new Date(this.travelDate))
        );
        console.log('Filtered schedules:', this.schedules);
        if (this.schedules.length === 0) {
          this.noRoutesFound = true;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching schedules:', error);
        this.handleError(error);
      }
    });
  }
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }
  formatTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private handleError(error: any): void {
    this.loading = false;
    this.message = "An error occurred while fetching data. Please try again.";
    this.messageType="error";
    console.error('Error:', error);
  }

  formatDuration(duration: string): string {
    const [hours, minutes] = duration.split(':');
    return `${hours}h ${minutes}min`;
  }



  travelDate: Date = new Date();
  showDatePicker: boolean = false;
  currentMonth: Date = new Date();
  calendarDays: number[] = [];
  daysOfWeek: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  openDatePicker() {
    this.showDatePicker = !this.showDatePicker;
    if (this.showDatePicker) {
      this.currentMonth = new Date(this.travelDate);
      this.generateCalendar();
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

  selectDate(day: number) {
    if (this.isCurrentMonth(day)) {
      this.travelDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
      this.showDatePicker = false;
    }
  }

  isSelectedDate(day: number): boolean {
    return this.travelDate.getDate() === day &&
      this.travelDate.getMonth() === this.currentMonth.getMonth() &&
      this.travelDate.getFullYear() === this.currentMonth.getFullYear();
  }

  isCurrentMonth(day: number): boolean {
    return day !== 0;
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



  // route-page.component.ts
  bookScheduleAndCreateReservation(schedule: Schedule): void {
    if (!this.authService.isLoggedIn()) {
      this.message = "Please log in to book a trip.";
      this.messageType = "error";
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }

    if (!schedule) {
      console.error('Attempted to book a null schedule');
      return;
    }

    console.log('route-page: Selected Schedule->', schedule);
    this.sharedDataService.setSelectedSchedule(schedule);

    this.authService.getCurrentUserId().pipe(
      tap(userId => console.log('User ID:', userId)),
      switchMap(userId => {
        if (!userId) {
          console.error('User not logged in');
          this.router.navigate(['/login']);
          return of(null);
        }
        const reservationDTO = {
          userId: userId,
          routeId: schedule.route.routeID
        };
        console.log('Reservation DTO:', reservationDTO);
        return this.reservationService.createReservation(reservationDTO);
      })
    ).subscribe({
      next: (reservation) => {
        if (reservation) {
          console.log('Reservation created:', reservation);
          this.router.navigate(['/booking']);
        } else {
          console.error('No reservation returned');
          // Optionally navigate to /routes if reservation creation fails
          // this.router.navigate(['/routes']);
        }
      },
      error: (error) => {
        console.error('Error creating reservation:', error);
        // Show an error message to the user
        // Optionally navigate to /routes if reservation creation fails
        // this.router.navigate(['/routes']);
      }
    });
  }


}







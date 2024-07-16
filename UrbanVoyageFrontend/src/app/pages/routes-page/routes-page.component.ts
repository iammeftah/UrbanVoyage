import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Schedule } from 'src/app/models/schedule.model';
import { Route } from 'src/app/models/route.model';
import { RouteService } from 'src/app/services/route.service';
import { ScheduleService } from 'src/app/services/schedule.service';


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
  travelDate: string = '';
  schedules: Schedule[] = [];
  noRoutesFound: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  searchPerformed: boolean = false;

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
    { name: 'Essaouira', address: '109 Avenue de l\'Istiqlal, Essaouira', lat: 31.5085, lng: -9.7595 }
  ];


  constructor(
    private routeService: RouteService,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {}

  searchRoutes(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.noRoutesFound = false;
    this.schedules = [];
    this.searchPerformed = true;

    this.routeService.findByDepartureAndArrival(this.departureCity, this.arrivalCity).subscribe({
      next: (routes) => {
        if (routes.length === 0) {
          this.noRoutesFound = true;
        } else {
          this.loadSchedulesForRoutes(routes);
        }
        this.isLoading = false;
      },
      error: (error) => {
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
        this.schedules = scheduleArrays.flat().filter(schedule =>
          this.isSameDay(new Date(schedule.departureTime), new Date(this.travelDate))
        );
        if (this.schedules.length === 0) {
          this.noRoutesFound = true;
        }
      },
      error: (error) => {
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
    this.isLoading = false;
    this.errorMessage = 'An error occurred while fetching data. Please try again.';
    console.error('Error:', error);
  }
}







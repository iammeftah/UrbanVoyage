import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { RouteService } from '../../services/route.service';
import { ScheduleService } from '../../services/schedule.service';
import { ReservationService } from '../../services/reservation.service';
import { UserService } from '../../services/user.service';
import { Route } from '../../models/route.model';
import { Schedule } from '../../models/schedule.model';
import { Reservation } from "../../models/reservation.model";
import {DistanceService} from "../../services/distance.service";
import {PricingService} from "../../services/pricing.service";
import {RefundService} from "../../services/refund.service";
import {Passenger} from "../../models/passenger.model";

declare var google: any;

interface AgencyLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

declare global {
  interface Window {
    initMap: () => void;
  }
}

interface Statistics {
  totalUsers: number;
  totalPassengers: number;
  reservationsPerMonth: number[];
}

@Component({
  selector: 'app-backoffice-page',
  templateUrl: './backoffice-page.component.html',
  styleUrls: ['./backoffice-page.component.css']
})
export class BackofficePageComponent implements OnInit, AfterViewInit {
  activeTab: 'routes' | 'schedules' | 'reservations' | 'statistics' | 'refunds' = 'routes';
  tabs: ('routes' | 'schedules' | 'reservations' | 'statistics' | 'refunds')[] = ['routes', 'schedules', 'reservations', 'statistics', 'refunds'];
  refundRequests: any[] = [];
  routes: Route[] = [];
  schedules: Schedule[] = [];
  reservations: Reservation[] = [];
  statistics: Statistics = { totalUsers: 0, totalPassengers: 0, reservationsPerMonth: [] };
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  isEditingRoute: boolean = false;
  isEditingSchedule: boolean = false;
  editingRoute: Route | null = null;
  editingSchedule: Schedule | null = null;

  seatType: 'STANDARD' | 'PREMIUM' | 'VIP' = 'STANDARD' ;

  showDateTimePicker: 'new' | 'edit' | null = null;
  selectedTime: string = '';

  loading: boolean = false;


  openDateTimePicker(type: 'new' | 'edit'): void {
    this.showDateTimePicker = type;
    const currentDate = type === 'new' ? this.newSchedule.departureTime : this.editingSchedule?.departureTime;
    if (currentDate) {
      const date = new Date(currentDate);
      this.selectedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      this.selectedTime = '00:00';
    }
  }

  updateDateTime(type: 'new' | 'edit'): void {
    const [hours, minutes] = this.selectedTime.split(':');
    let date = type === 'new' ? new Date(this.newSchedule.departureTime || new Date()) : new Date(this.editingSchedule?.departureTime || new Date());

    // Set the time while preserving the timezone offset
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    // Format the date as ISO string but preserve the local time
    const isoString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();

    if (type === 'new') {
      this.newSchedule.departureTime = isoString;
    } else {
      if (this.editingSchedule) {
        this.editingSchedule.departureTime = isoString;
      }
    }
  }

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

  newRoute: Partial<Route> = {};
  newSchedule: Partial<Schedule> = {};

  userChart?: Chart;
  reservationChart?: Chart;

  cityDistances: { [key: string]: { [key: string]: number } } = {};
  private distanceMatrixService: any;

  private googleMapsLoadedPromise!: Promise<void>;

  constructor(
    private routeService: RouteService,
    private scheduleService: ScheduleService,
    private reservationService: ReservationService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private distanceService: DistanceService,
    private pricingService: PricingService,
    private refundService: RefundService
  ) {
    this.initializeCityDistances();
    this.newSchedule = {
      availableSeats: 50,
    };
    this.googleMapsLoadedPromise = Promise.resolve();
  }



  ngOnInit(): void {
    console.log('Initial newSchedule:', this.newSchedule);

    this.loadRoutes();
    this.loadSchedules();
    this.loadStatistics();
    this.initializeGoogleMaps();
    this.loadReservations();
  }

  ngAfterViewInit(): void {
    if (this.activeTab === 'statistics') {
      setTimeout(() => this.initializeCharts(), 0);
    }
  }

  private googleMapsLoaded = false;

  initializeGoogleMaps(): void {
    this.googleMapsLoadedPromise = new Promise<void>((resolve) => {
      if (window.google && window.google.maps) {
        this.initializeDistanceMatrixService();
        resolve();
        return;
      }

      if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCDjOf_9XM-mSZ9h4Hv9ukO5YCCBIrxIHc&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;

      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        // Handle the error appropriately
      };

      window.initMap = () => {
        this.initializeDistanceMatrixService();
        this.googleMapsLoaded = true;
        resolve();
      };

      document.head.appendChild(script);
    });
  }

  private initializeDistanceMatrixService(): void {
    if (window.google && window.google.maps) {
      this.distanceMatrixService = new google.maps.DistanceMatrixService();
    } else {
      console.error('Google Maps API not loaded');
      // Handle this error state appropriately
    }
  }



  initializeCityDistances(): void {
    this.locations.forEach(city1 => {
      this.cityDistances[city1.name] = {};
      this.locations.forEach(city2 => {
        if (city1.name !== city2.name) {
          const distance = this.distanceService.calculateDistance(city1.lat, city1.lng, city2.lat, city2.lng);
          this.cityDistances[city1.name][city2.name] = Math.round(distance);
        }
      });
    });
  }


  loadRoutes(): void {
    this.loading = true;
    this.routeService.getRoutes().subscribe({
      next: (routes) => {
        this.loading=false;
        this.routes = routes;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading=false;
        console.error('Error loading routes:', error);
        this.showMessage('Error loading routes: ' + (error.message || 'Unknown error'), 'error');
      }
    });
  }

  loadSchedules(): void {
    this.loading=true;
    this.scheduleService.getSchedules().subscribe({
      next: (schedules) => {
        this.loading=false;
        this.schedules = schedules;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading=false;
        console.error('Error loading schedules:', error);
        this.showMessage('Error loading schedules: ' + (error.message || 'Unknown error'), 'error');
      }
    });
  }

  loadStatistics(): void {
    this.loading=true;
    this.userService.getAllUsers().subscribe({

      next: (users) => {
        this.loading=false;

        this.statistics.totalUsers = users.length;
        this.statistics.totalPassengers = users.filter(user => user.hasReservations).length;

        // Calculate reservations per month (dummy data for example)
        this.statistics.reservationsPerMonth = Array(12).fill(0).map(() => Math.floor(Math.random() * 100));

        if (this.activeTab === 'statistics') {
          this.initializeCharts();
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading=false;

        this.showMessage('Error loading statistics: ' + error.message, 'error');
      }
    });
  }

  initializeCharts(): void {
    const cyan500 = '#06b6d4';
    const cyan400 = '#22d3ee';

    const userChartConfig: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: ['Total Users', 'Total Passengers'],
        datasets: [{
          data: [this.statistics.totalUsers, this.statistics.totalPassengers],
          backgroundColor: [cyan500, cyan400]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'User Distribution'
          }
        },
        aspectRatio: 2
      }
    };

    const reservationChartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Reservations per Month',
          data: this.statistics.reservationsPerMonth,
          borderColor: cyan500,
          backgroundColor: cyan400,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Monthly Reservations'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    if (this.userChart) {
      this.userChart.destroy();
    }
    if (this.reservationChart) {
      this.reservationChart.destroy();
    }

    this.userChart = new Chart('userChart', userChartConfig);
    this.reservationChart = new Chart('reservationChart', reservationChartConfig);
  }

  addRoute(): void {
    console.log('Adding schedule:', this.newSchedule);

    if (!this.newRoute.departureCity || !this.newRoute.arrivalCity) {
      this.message = "Please select both departure and arrival cities.";
      this.messageType="error";
      return;
    }

    const distance = this.cityDistances[this.newRoute.departureCity][this.newRoute.arrivalCity];
    if (distance === undefined) {
      this.message = "Distance not found for the selected cities.";
      this.messageType="error";
      return;
    }

    this.newRoute.distance = distance;

    this.routeService.addRoute(this.newRoute as Route).subscribe({

      next: (route) => {
        this.routes.push(route);
        this.newRoute = {};
        this.loadRoutes(); // Reload routes to ensure consistency
        this.message = "Route added successfully";
        this.messageType="success";

      },
      error: (error) => {
        console.error('Error adding route:', error);
        this.message = "Error adding route: " + (error.message || 'Unknown error');
        this.messageType="error";
      }
    });
  }

  updateRoute(): void {
    if (!this.editingRoute || !this.editingRoute.departureCity || !this.editingRoute.arrivalCity) {
      this.message = "Invalid route data. Please check all fields.";
      this.messageType="error";
      return;
    }

    const distance = this.cityDistances[this.editingRoute.departureCity][this.editingRoute.arrivalCity];
    if (distance === undefined) {
      this.message = "Distance not found for the selected cities.";
      this.messageType="error";
      return;
    }

    this.editingRoute.distance = distance;

    this.routeService.updateRoute(this.editingRoute).subscribe({
      next: (updatedRoute) => {
        const index = this.routes.findIndex(r => r.routeID === updatedRoute.routeID);
        if (index !== -1) {
          this.routes[index] = updatedRoute;
        }
        this.message = "Route updated successfully";
        this.messageType="success";
        this.closeRouteEditForm();
        this.loadRoutes(); // Reload routes to ensure consistency
      },
      error: (error) => {
        console.error('Error updating route:', error);
        this.message = 'Error updating route: ' + (error.message || 'Unknown error');
        this.messageType="error";

      }
    });
  }

  deleteRoute(routeID: number): void {



    this.routeService.deleteRoute(routeID).subscribe({
      next: () => {
        this.routes = this.routes.filter(r => r.routeID !== routeID);
        this.message = "Route deleted successfully";
        this.messageType="success";
        this.loadRoutes(); // Reload routes to ensure consistency
      },
      error: (error) => {
        console.error('Error deleting route:', error);
        if (error.status === 400) {
          this.message = "Cannot delete route with active schedules";
          this.messageType="error";
        } else {
          this.message = "Error deleting route: " + (error.message || 'Unknown error');
          this.messageType="error";
        }
      }
    });
  }

  addSchedule(): void {
    if (!this.newSchedule.route || !this.newSchedule.departureTime || this.newSchedule.availableSeats === undefined) {
      this.message = "Please fill in all required fields.";
      this.messageType = "error";
      return;
    }

    let routeId: number;
    if (typeof this.newSchedule.route === 'number') {
      routeId = this.newSchedule.route;
    } else if (this.newSchedule.route && 'routeID' in this.newSchedule.route) {
      routeId = this.newSchedule.route.routeID;
    } else {
      this.message = "Invalid route selected.";
      this.messageType = "error";
      return;
    }

    const route = this.routes.find(r => r.routeID === routeId);
    if (!route) {
      this.message = "Selected route not found.";
      this.messageType = "error";
      return;
    }

    this.calculateTravelTime(route.departureCity, route.arrivalCity).then(travelTimeSeconds => {
      const departureTime = new Date(this.newSchedule.departureTime!);
      // Adjust for timezone offset
      const timezoneOffset = departureTime.getTimezoneOffset() * 60000;
      const adjustedDepartureTime = new Date(departureTime.getTime() - timezoneOffset);

      const arrivalTime = new Date(adjustedDepartureTime.getTime() + travelTimeSeconds * 1000);

      const distanceFromDepartureToArrival = this.cityDistances[route.departureCity][route.arrivalCity];
      const schedulePrice = this.pricingService.calculateTicketPrice(distanceFromDepartureToArrival, this.seatType);

      const scheduleToAdd: Omit<Schedule, 'scheduleID'> = {
        route: { routeID: routeId } as Route,
        departureTime: adjustedDepartureTime.toISOString(),
        arrivalTime: arrivalTime.toISOString(),
        availableSeats: this.newSchedule.availableSeats || 50,
        duration: null,
        schedulePrice: schedulePrice,
        seatType: 'STANDARD'
      };

      this.scheduleService.addSchedule(scheduleToAdd).subscribe({
        next: (schedule) => {
          this.schedules.push(schedule);
          this.newSchedule = {
            departureTime: new Date().toISOString(),
            availableSeats: 50
          };
          this.message = "Schedule added successfully";
          this.messageType = "success";
          this.loadSchedules();
        },
        error: (error) => {
          console.error('Error adding schedule:', error);
          this.message = 'Error adding schedule: ' + (error.message || 'Unknown error');
          this.messageType = "error";
        }
      });
    }).catch(error => {
      this.message = 'Error calculating travel time: ' + error;
      this.messageType = "error";
    });
  }

  updateSchedule(): void {
    if (!this.editingSchedule || !this.editingSchedule.scheduleID) {
      this.message = 'No valid schedule is currently being edited';
      this.messageType = "error";
      return;
    }

    let routeId: number | undefined;
    if (typeof this.editingSchedule.route === 'number') {
      routeId = this.editingSchedule.route;
    } else if (this.editingSchedule.route && 'routeID' in this.editingSchedule.route) {
      routeId = this.editingSchedule.route.routeID;
    }

    if (routeId === undefined) {
      this.message = 'Invalid route data for this schedule';
      this.messageType = "error";
      return;
    }

    const route = this.routes.find(r => r.routeID === routeId);
    if (!route) {
      this.message = 'Route not found for this schedule';
      this.messageType = "error";
      return;
    }

    this.calculateTravelTime(route.departureCity, route.arrivalCity).then(travelTimeSeconds => {
      const departureTime = new Date(this.editingSchedule!.departureTime);
      // Adjust for timezone offset
      const timezoneOffset = departureTime.getTimezoneOffset() * 60000;
      const adjustedDepartureTime = new Date(departureTime.getTime() - timezoneOffset);

      const arrivalTime = new Date(adjustedDepartureTime.getTime() + travelTimeSeconds * 1000);

      const distanceFromDepartureToArrival = this.cityDistances[route.departureCity][route.arrivalCity];
      const schedulePrice = this.pricingService.calculateTicketPrice(distanceFromDepartureToArrival, this.seatType);

      const scheduleToUpdate: Schedule = {
        scheduleID: this.editingSchedule!.scheduleID,
        route: { routeID: routeId } as Route,
        departureTime: adjustedDepartureTime.toISOString(),
        arrivalTime: arrivalTime.toISOString(),
        availableSeats: this.editingSchedule!.availableSeats,
        duration: null,
        schedulePrice: schedulePrice,
        seatType: 'STANDARD'
      };

      this.scheduleService.updateSchedule(scheduleToUpdate).subscribe({
        next: (updatedSchedule) => {
          const index = this.schedules.findIndex(s => s.scheduleID === updatedSchedule.scheduleID);
          if (index !== -1) {
            this.schedules[index] = updatedSchedule;
          }
          this.message = 'Schedule updated successfully';
          this.messageType = "success";
          this.closeScheduleEditForm();
          this.loadSchedules();
        },
        error: (error) => {
          console.error('Error updating schedule:', error);
          this.message = 'Error updating schedule: ' + (error.message || 'Unknown error');
          this.messageType = "error";
        }
      });
    }).catch(error => {
      this.message = 'Error calculating travel time: ' + error;
      this.messageType = "error";
    });
  }

  formatDateToLocalISO(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

  deleteSchedule(scheduleID: number): void {

    this.scheduleService.deleteSchedule(scheduleID).subscribe({
      next: () => {
        this.schedules = this.schedules.filter(s => s.scheduleID !== scheduleID);
        this.message = 'Schedule deleted successfully.' ;
        this.messageType="success";
        this.loadSchedules(); // Reload schedules to ensure consistency
      },
      error: (error) => {
        console.error('Error deleting schedule:', error);
        this.message = 'Error deleting schedule: ' + (error.message || 'Unknown error') ;
        this.messageType="error";
      }
    });
  }

  loadReservations(): void {
    this.reservationService.getReservations().subscribe({
      next: (reservations) => {
        console.log('Received reservations:', reservations);
        this.reservations = reservations.map(reservation => {
          console.log('Processing reservation:', reservation);
          return {
            ...reservation,
            id: reservation.id || reservation.reservationID // Check if the ID is under a different property name
          };
        });
        console.log('Processed reservations:', this.reservations);
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
      }
    });
  }

  updateReservationStatus(reservation: Reservation, newStatus: string): void {
    this.reservationService.updateReservationStatus(reservation.reservationID, newStatus).subscribe({
      next: (updatedReservation) => {
        console.log('Reservation updated successfully:', updatedReservation);
        // Update the reservation in your local array
        const index = this.reservations.findIndex(r => r.reservationID === updatedReservation.reservationID);
        if (index !== -1) {
          this.reservations[index] = updatedReservation;
        }
        this.showMessage(`Reservation ${newStatus.toLowerCase()} successfully`, 'success');
      },
      error: (error) => {
        console.error('Error updating reservation:', error);
        this.showMessage(error.message, 'error');
      }
    });
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => this.closeMessage(), 5000); // Clear message after 5 seconds
  }

  closeMessage(): void {
    this.message = null;
  }

  openRouteEditForm(route: Route): void {
    this.editingRoute = { ...route };
    this.isEditingRoute = true;
  }

  closeRouteEditForm(): void {
    this.editingRoute = null;
    this.isEditingRoute = false;
  }

  openScheduleEditForm(schedule: Schedule): void {
    this.editingSchedule = { ...schedule };

    let routeId: number | undefined;
    if (typeof this.editingSchedule.route === 'number') {
      routeId = this.editingSchedule.route;
    } else if (this.editingSchedule.route && 'routeID' in this.editingSchedule.route) {
      routeId = this.editingSchedule.route.routeID;
    }

    if (routeId !== undefined) {
      const route = this.routes.find(r => r.routeID === routeId);
      if (route) {
        this.calculateTravelTime(route.departureCity, route.arrivalCity).then(travelTimeSeconds => {
          if (this.editingSchedule) {
            const departureTime = new Date(this.editingSchedule.departureTime);
            const arrivalTime = new Date(departureTime.getTime() + travelTimeSeconds * 1000);

            this.editingSchedule.departureTime = departureTime.toISOString();
            this.editingSchedule.arrivalTime = arrivalTime.toISOString();
          }
        }).catch(error => {
          this.showMessage('Error calculating travel time: ' + error, 'error');
        });
      }
    }

    this.isEditingSchedule = true;
  }

  closeScheduleEditForm(): void {
    this.editingSchedule = null;
    this.isEditingSchedule = false;
  }

  setActiveTab(tab: 'routes' | 'schedules' | 'reservations' | 'statistics' | 'refunds'): void {
    this.activeTab = tab;
    if (tab === 'statistics') {
      setTimeout(() => this.initializeCharts(), 0);
    } else if (tab === 'refunds') {
      this.loadRefundRequests();
    }
  }

  getTabIcon(tab: string): string {
    switch (tab) {
      case 'routes':
        return 'directions';
      case 'schedules':
        return 'schedule';
      case 'reservations':
        return 'book';
      case 'statistics':
        return 'bar_chart';
      case 'refunds':
        return 'undo'; // or 'replay' or any other suitable icon
      default:
        return 'error';
    }
  }

  loadRefundRequests() {
    this.refundService.getRefundRequests().subscribe(
      (requests) => {
        this.refundRequests = requests;
      },
      (error) => {
        console.error('Error loading refund requests', error);
        // Handle error (show message to user, etc.)
      }
    );
  }

  approveRefund(request: Passenger) {
    if (request.id != null) {
      this.refundService.approveRefund(request.id).subscribe(
        () => {
          request.status = "REFUND_APPROVED";
          // Optionally, reload all requests or update the local array
        },
        (error) => {
          console.error('Error approving refund', error);
          // Handle error (show message to user, etc.)
        }
      );
    }else{
      console.log("request.id = null")
    }
  }

  rejectRefund(request: Passenger) {
    if (request.id != null) {
      this.refundService.rejectRefund(request.id).subscribe(
        () => {
          request.status = 'REFUND_REJECTED';
          // Optionally, reload all requests or update the local array
        },
        (error) => {
          console.error('Error rejecting refund', error);
          // Handle error (show message to user, etc.)
        }
      );
    }else{
      console.log("request.id = null")
    }
  }




  calculateTravelTime(origin: string, destination: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const originLocation = this.locations.find(loc => loc.name === origin);
      const destLocation = this.locations.find(loc => loc.name === destination);

      if (!originLocation || !destLocation) {
        reject('Location not found');
        return;
      }

      const distance = this.distanceService.calculateDistance(
        originLocation.lat, originLocation.lng,
        destLocation.lat, destLocation.lng
      );

      // Assume an average speed of 60 km/h
      const averageSpeed = 60; // km/h
      const travelTimeHours = distance / averageSpeed;
      const travelTimeSeconds = Math.round(travelTimeHours * 3600); // Convert hours to seconds

      resolve(travelTimeSeconds);
    });
  }

}

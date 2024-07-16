import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { RouteService } from '../../services/route.service';
import { ScheduleService } from '../../services/schedule.service';
import { ReservationService } from '../../services/reservation.service';
import { UserService } from '../../services/user.service';
import { Route } from '../../models/route.model';
import { Schedule } from '../../models/schedule.model';
import { Reservation } from "../../models/reservation.model";

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
  activeTab: 'routes' | 'schedules' | 'reservations' | 'statistics' = 'routes';
  tabs: ('routes' | 'schedules' | 'reservations' | 'statistics')[] = ['routes', 'schedules', 'reservations', 'statistics'];
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
    private cdr: ChangeDetectorRef
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
          const distance = this.calculateDistance(city1.lat, city1.lng, city2.lat, city2.lng);
          this.cityDistances[city1.name][city2.name] = Math.round(distance);
        }
      });
    });
  }


  loadRoutes(): void {
    this.routeService.getRoutes().subscribe({
      next: (routes) => {
        this.routes = routes;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading routes:', error);
        this.showMessage('Error loading routes: ' + (error.message || 'Unknown error'), 'error');
      }
    });
  }

  loadSchedules(): void {
    this.scheduleService.getSchedules().subscribe({
      next: (schedules) => {
        this.schedules = schedules;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading schedules:', error);
        this.showMessage('Error loading schedules: ' + (error.message || 'Unknown error'), 'error');
      }
    });
  }

  loadStatistics(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
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
      this.messageType="error";
      return;
    }

    if(!this.newSchedule.departureTime){
      this.message = "Please fill in all required fields.";
      this.messageType="error";
      return ;
    }

    let routeId: number;
    if (typeof this.newSchedule.route === 'number') {
      routeId = this.newSchedule.route;
    } else if (this.newSchedule.route && 'routeID' in this.newSchedule.route) {
      routeId = this.newSchedule.route.routeID;
    } else {
      this.message = "Invalid route selected.";
      this.messageType="error";


      return;
    }

    const route = this.routes.find(r => r.routeID === routeId);
    if (!route) {
      this.message = "Selected route not found.";
      this.messageType="error";
      return;
    }

    this.calculateTravelTime(route.departureCity, route.arrivalCity).then(travelTimeSeconds => {
      const departureTime = new Date(this.newSchedule.departureTime!);
      const arrivalTime = new Date(departureTime.getTime() + travelTimeSeconds * 1000);

      const scheduleToAdd: Omit<Schedule, 'scheduleID'> = {
        route: { routeID: routeId } as Route,
        departureTime: departureTime.toISOString(),
        arrivalTime: arrivalTime.toISOString(),
        availableSeats: this.newSchedule.availableSeats || 50,
        duration:null
      };

      this.scheduleService.addSchedule(scheduleToAdd).subscribe({
        next: (schedule) => {
          this.schedules.push(schedule);
          this.newSchedule = {
            departureTime: new Date().toISOString(),
            availableSeats: 50
          };
          this.message = "Schedule added successfully";
          this.messageType="success";
          this.loadSchedules();
        },
        error: (error) => {
          console.error('Error adding schedule:', error);
          this.message = 'Error adding schedule: ' + (error.message || 'Unknown error');
          this.messageType="error";
        }
      });
    }).catch(error => {
      this.message = 'Error calculating travel time: ' + error;
      this.messageType="error";
    });
  }

  updateSchedule(): void {
    if (!this.editingSchedule || !this.editingSchedule.scheduleID) {
      this.message = 'No valid schedule is currently being edited';
      this.messageType="error";
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
      this.messageType="error";
      return;
    }

    const route = this.routes.find(r => r.routeID === routeId);
    if (!route) {
      this.message = 'Route not found for this schedule';
      this.messageType="error";
      return;
    }

    this.calculateTravelTime(route.departureCity, route.arrivalCity).then(travelTimeSeconds => {
      const departureTime = new Date(this.editingSchedule!.departureTime);
      const arrivalTime = new Date(departureTime.getTime() + travelTimeSeconds * 1000);

      const scheduleToUpdate: Schedule = {
        scheduleID: this.editingSchedule!.scheduleID,
        route: { routeID: routeId } as Route,
        departureTime: departureTime.toISOString(),
        arrivalTime: arrivalTime.toISOString(),
        availableSeats: this.editingSchedule!.availableSeats,
        duration: null  // Assuming selectedSchedule has a duration property
      };

      this.scheduleService.updateSchedule(scheduleToUpdate).subscribe({
        next: (updatedSchedule) => {
          const index = this.schedules.findIndex(s => s.scheduleID === updatedSchedule.scheduleID);
          if (index !== -1) {
            this.schedules[index] = updatedSchedule;
          }
          this.message = 'Schedule updated successfully';
          this.messageType="success";
          this.closeScheduleEditForm();
          this.loadSchedules();
        },
        error: (error) => {
          console.error('Error updating schedule:', error);
          this.message = 'Error updating schedule: ' + (error.message || 'Unknown error');
          this.messageType="error";
        }
      });
    }).catch(error => {
      this.message = 'Error calculating travel time: ' + error ;
      this.messageType="error";
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
        this.reservations = reservations;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.message = 'Error loading reservations: ' + error.message ;
        this.messageType="error";
      }
    });
  }

  updateReservationStatus(reservationId: number, newStatus: string): void {
    this.reservationService.updateReservationStatus(reservationId, newStatus).subscribe({
      next: (updatedReservation) => {
        const index = this.reservations.findIndex(r => r.reservationID === updatedReservation.reservationID);
        if (index !== -1) {
          this.reservations[index] = updatedReservation;
        }
        this.message = 'Reservation status updated successfully.' ;
        this.messageType="success";
      },
      error: (error) => {
        console.error('Error updating reservation status:', error);
        this.message = 'Error updating reservation status: ' + error.message ;
        this.messageType="error";
      }
    });
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 5000);
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

  setActiveTab(tab: 'routes' | 'schedules' | 'reservations' | 'statistics'): void {
    this.activeTab = tab;
    if (tab === 'statistics') {
      setTimeout(() => this.initializeCharts(), 0);
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
      default:
        return 'error';
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

      const distance = this.calculateDistance(
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

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

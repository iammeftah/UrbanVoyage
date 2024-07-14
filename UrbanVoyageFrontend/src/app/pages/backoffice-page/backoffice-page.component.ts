import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface AgencyLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface Route {
  routeID: number;
  departureCity: string;
  arrivalCity: string;
  distance: number;
}

interface Schedule {
  scheduleID: number;
  route: Route;
  departureTime: Date;
  arrivalTime: Date;
}

interface Reservation {
  reservationID: number;
  user: { id: number, name: string };
  route: Route;
  reservationDate: Date;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
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
export class BackofficePageComponent implements OnInit {
  activeTab: 'routes' | 'schedules' | 'reservations' | 'statistics' = 'routes';
  tabs: ('routes' | 'schedules' | 'reservations' | 'statistics')[] = ['routes', 'schedules', 'reservations', 'statistics'];
  routes: Route[] = [];
  schedules: Schedule[] = [];
  reservations: Reservation[] = [];
  statistics: Statistics = { totalUsers: 0, totalPassengers: 0, reservationsPerMonth: [] };

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

  cityDistances: { [key: string]: { [key: string]: number } } = {};

  newRoute: Route = { routeID: 0, departureCity: '', arrivalCity: '', distance: 0 };
  newSchedule: Schedule = {
    scheduleID: 0,
    route: { routeID: 0, departureCity: '', arrivalCity: '', distance: 0 },
    departureTime: new Date(),
    arrivalTime: new Date()
  };

  userChart?: Chart;
  reservationChart?: Chart;

  constructor() {
    this.initializeCityDistances();
  }

  ngOnInit(): void {
    this.loadRoutes();
    this.loadSchedules();
    this.loadReservations();
    this.loadStatistics();
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

  loadRoutes(): void {
    // TODO: Replace with actual API call
    this.routes = [
      { routeID: 1, departureCity: 'Casablanca', arrivalCity: 'Marrakech', distance: this.cityDistances['Casablanca']['Marrakech'] },
      { routeID: 2, departureCity: 'Rabat', arrivalCity: 'Fes', distance: this.cityDistances['Rabat']['Fes'] },
    ];
  }

  loadSchedules(): void {
    // TODO: Replace with actual API call
    this.schedules = [
      { scheduleID: 1, route: this.routes[0], departureTime: new Date('2023-05-01T08:00:00'), arrivalTime: new Date('2023-05-01T14:00:00') },
      { scheduleID: 2, route: this.routes[0], departureTime: new Date('2023-05-01T12:00:00'), arrivalTime: new Date('2023-05-01T18:00:00') },
    ];
  }

  loadReservations(): void {
    // TODO: Replace with actual API call
    this.reservations = [
      { reservationID: 1, user: { id: 1, name: 'John Doe' }, route: this.routes[0], reservationDate: new Date('2023-04-25'), status: 'CONFIRMED' },
      { reservationID: 2, user: { id: 2, name: 'Jane Smith' }, route: this.routes[1], reservationDate: new Date('2023-04-26'), status: 'PENDING' },
    ];
  }

  loadStatistics(): void {
    // TODO: Replace with actual API call
    this.statistics = {
      totalUsers: 1000,
      totalPassengers: 750,
      reservationsPerMonth: [65, 59, 80, 81, 56, 55, 40, 45, 70, 75, 80, 90]
    };
    console.log('Statistics loaded:', this.statistics);
    this.initializeCharts();
  }

  initializeCharts(): void {
    console.log('Initializing charts');

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
    console.log('Charts initialized');
  }

  addRoute(): void {
    if (this.newRoute.departureCity && this.newRoute.arrivalCity) {
      this.newRoute.routeID = this.routes.length + 1;
      this.newRoute.distance = this.cityDistances[this.newRoute.departureCity][this.newRoute.arrivalCity];
      this.routes.push({ ...this.newRoute });
      this.newRoute = { routeID: 0, departureCity: '', arrivalCity: '', distance: 0 };
    }
  }

  updateRoute(route: Route): void {
    const index = this.routes.findIndex(r => r.routeID === route.routeID);
    if (index !== -1) {
      route.distance = this.cityDistances[route.departureCity][route.arrivalCity];
      this.routes[index] = { ...route };
    }
  }

  deleteRoute(id: number): void {
    // TODO: Replace with actual API call
    this.routes = this.routes.filter(r => r.routeID !== id);
  }

  addSchedule(): void {
    // TODO: Replace with actual API call
    this.newSchedule.scheduleID = this.schedules.length + 1;
    this.schedules.push({ ...this.newSchedule });
    this.newSchedule = {
      scheduleID: 0,
      route: { routeID: 0, departureCity: '', arrivalCity: '', distance: 0 },
      departureTime: new Date(),
      arrivalTime: new Date()
    };
  }

  updateSchedule(schedule: Schedule): void {
    // TODO: Replace with actual API call
    const index = this.schedules.findIndex(s => s.scheduleID === schedule.scheduleID);
    if (index !== -1) {
      this.schedules[index] = { ...schedule };
    }
  }

  deleteSchedule(id: number): void {
    // TODO: Replace with actual API call
    this.schedules = this.schedules.filter(s => s.scheduleID !== id);
  }

  updateReservationStatus(reservation: Reservation, newStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED'): void {
    // TODO: Replace with actual API call
    const index = this.reservations.findIndex(r => r.reservationID === reservation.reservationID);
    if (index !== -1) {
      this.reservations[index] = { ...reservation, status: newStatus };
    }
  }

  setActiveTab(tab: 'routes' | 'schedules' | 'reservations' | 'statistics'): void {
    this.activeTab = tab;
    console.log('Active tab set to:', tab);
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
}

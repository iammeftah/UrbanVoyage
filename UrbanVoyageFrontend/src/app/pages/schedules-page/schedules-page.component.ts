import { Component, OnInit } from '@angular/core';

interface Schedule {
  departure: { time: string; location: string };
  arrival: { time: string; location: string };
  destination: { city: string; state: string };
  travelType: string;
  duration: string;
  price: number;
}

@Component({
  selector: 'app-schedules-page',
  templateUrl: './schedules-page.component.html',
  styleUrls: ['./schedules-page.component.css']
})
export class SchedulesPageComponent implements OnInit {
  schedules: Schedule[] = [
    {
      departure: { time: '8:00 AM', location: 'San Francisco' },
      arrival: { time: '11:30 AM', location: 'Los Angeles' },
      destination: { city: 'Los Angeles', state: 'California' },
      travelType: 'Bus',
      duration: '3h 30m',
      price: 50
    },
    {
      departure: { time: '10:00 AM', location: 'New York' },
      arrival: { time: '2:30 PM', location: 'Boston' },
      destination: { city: 'Boston', state: 'Massachusetts' },
      travelType: 'Train',
      duration: '4h 30m',
      price: 80
    },
    {
      departure: { time: '1:00 PM', location: 'Chicago' },
      arrival: { time: '5:30 PM', location: 'Detroit' },
      destination: { city: 'Detroit', state: 'Michigan' },
      travelType: 'Van',
      duration: '1h 30m',
      price: 120
    },
    {
      departure: { time: '10:30 AM', location: 'Chicago' },
      arrival: { time: '2:00 PM', location: 'Dallas' },
      destination: { city: 'Dallas', state: 'Texas' },
      travelType: 'Train',
      duration: '4h 30m',
      price: 90
    },
    {
      departure: { time: '1:00 PM', location: 'Miami' },
      arrival: { time: '5:30 PM', location: 'Orlando' },
      destination: { city: 'Orlando', state: 'Florida' },
      travelType: 'Van',
      duration: '2h 30m',
      price: 120
    }
  ];

  filteredSchedules: Schedule[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filterText: string = '';

  ngOnInit() {
    this.filteredSchedules = [...this.schedules];
  }

  toggleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortSchedules();
  }

  sortSchedules() {
    this.filteredSchedules.sort((a: any, b: any) => {
      const aValue = this.getNestedProperty(a, this.sortColumn);
      const bValue = this.getNestedProperty(b, this.sortColumn);
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, key) => (o && o[key] !== undefined) ? o[key] : null, obj);
  }

  applyFilter() {
    this.filteredSchedules = this.schedules.filter(schedule =>
      schedule.destination.city.toLowerCase().includes(this.filterText.toLowerCase()) ||
      schedule.destination.state.toLowerCase().includes(this.filterText.toLowerCase()) ||
      schedule.travelType.toLowerCase().includes(this.filterText.toLowerCase())
    );
    this.sortSchedules();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'bx bx-sort';
    return this.sortDirection === 'asc' ? 'bx bx-sort-up' : 'bx bx-sort-down';
  }
}

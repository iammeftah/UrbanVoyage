import { Component, OnInit } from '@angular/core';
import { Schedule } from 'src/app/models/schedule.model';
import { ScheduleService } from 'src/app/services/schedule.service';


@Component({
  selector: 'app-schedules-page',
  templateUrl: './schedules-page.component.html',
  styleUrls: ['./schedules-page.component.css']
})
export class SchedulesPageComponent implements OnInit {
  schedules: Schedule[] = [];
  filteredSchedules: Schedule[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filterText: string = '';
  loading: boolean = false;


  constructor(private scheduleService: ScheduleService) {}

  ngOnInit() {
    this.loadSchedules();
  }

  loadSchedules() {
    this.loading=true;
    this.scheduleService.getSchedules().subscribe({
      next: (data) => {
        this.loading=false;
        this.schedules = data;
        this.filteredSchedules = [...this.schedules];
        this.sortSchedules();
      },
      error: (error) => {
        this.loading=false;
        console.error('Error fetching schedules:', error);
      }
    });
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
      schedule.route.departureCity.toLowerCase().includes(this.filterText.toLowerCase()) ||
      schedule.route.arrivalCity.toLowerCase().includes(this.filterText.toLowerCase())
    );
    this.sortSchedules();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'bx bx-sort';
    return this.sortDirection === 'asc' ? 'bx bx-sort-up' : 'bx bx-sort-down';
  }
}

// src/app/services/shared-data.service.ts

import { Injectable } from '@angular/core';
import { Schedule } from '../models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private selectedSchedule: Schedule | null = null;

  setSelectedSchedule(schedule: Schedule) {
    this.selectedSchedule = schedule;
  }

  getSelectedSchedule(): Schedule | null {
    return this.selectedSchedule;
  }

  clearSelectedSchedule() {
    this.selectedSchedule = null;
  }
}
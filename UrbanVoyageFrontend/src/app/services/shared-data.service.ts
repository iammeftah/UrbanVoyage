// src/app/services/shared-data.service.ts

import { Injectable } from '@angular/core';
import { Schedule } from '../models/schedule.model';
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private selectedSchedule: Schedule | null = null;
  private bookingUser: User | null = null;

  setSelectedSchedule(schedule: Schedule) {
    this.selectedSchedule = schedule;
  }

  getSelectedSchedule(): Schedule | null {
    return this.selectedSchedule;
  }

  clearSelectedSchedule() {
    this.selectedSchedule = null;
  }

  setBookingUser(user: User | null): void {
    this.bookingUser = user;
  }
  getBookingUser():User | null {
    return this.bookingUser;
  }
  clearBookingUser():void {
    this.bookingUser = null;
  }

}

// schedule-management.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleManagementService {
  private apiUrl = 'http://localhost:8080/api/schedule-management';

  constructor(private http: HttpClient) { }

  generateWeeklySchedules(): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-weekly-schedules`, {});
  }

  getProgress(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/progress`);
  }

  deleteExpiredSchedules(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-expired-schedules`);
  }

  refreshSchedules(): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh-schedules`, {});
  }
}

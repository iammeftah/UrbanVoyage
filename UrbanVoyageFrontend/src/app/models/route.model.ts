import { Schedule } from './schedule.model';

export interface Route {
  routeID: number;
  departureCity: string;
  arrivalCity: string;
  distance: number;
  schedules?: Schedule[];
}



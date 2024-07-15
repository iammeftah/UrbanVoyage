import {Route} from "./route.model";


export interface Schedule {
  scheduleID: number;
  departureTime: string;
  arrivalTime: string;
  route: {
    routeID: number;
    departureCity: string;
    arrivalCity: string;
    distance: number;
  };
  availableSeats: number;


  // other fields...
}



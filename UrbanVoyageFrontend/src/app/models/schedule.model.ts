import {Route} from "./route.model";


export interface Schedule {
  duration: any;
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



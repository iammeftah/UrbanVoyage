import {Route} from "./route.model";
import {Reservation} from "./reservation.model";


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
  schedulePrice: number;
  seatType: 'STANDARD' | 'PREMIUM' | 'VIP';


  // other fields...
}



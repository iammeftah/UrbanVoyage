import {Route} from "./route.model";

export interface Reservation {
  reservationID: number;
  user: { id: number; name: string };
  route: Route;
  reservationDate: Date;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

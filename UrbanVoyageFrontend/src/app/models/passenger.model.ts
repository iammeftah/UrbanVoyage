export interface Passenger {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string; // Change to string to match Java entity
  specialRequests: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  seatType: 'STANDARD' | 'PREMIUM' | 'VIP';
  schedulePrice: number;
}

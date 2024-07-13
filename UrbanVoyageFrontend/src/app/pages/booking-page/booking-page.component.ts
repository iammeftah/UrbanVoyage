import { Component } from '@angular/core';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent {
  seatTypes: string[] = ['Standard Seat', 'Premium Seat', 'VIP Seat'];
  selectedSeatTypeIndex: number | null = null;

  selectSeatType(index: number): void {
    this.selectedSeatTypeIndex = index;
  }

  getSeatTypeButtonClass(index: number): string {
    const baseClasses = 'w-full flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none ';
    const activeClasses = 'w-full bg-cyan-600 text-white hover:bg-cyan-700 ';
    const inactiveClasses = 'w-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600';

    return `${baseClasses} ${this.selectedSeatTypeIndex === index ? activeClasses : inactiveClasses}`;
  }
}

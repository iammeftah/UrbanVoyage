import {Component, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";
import {ScheduleService} from "../../services/schedule.service";
import {Schedule} from "../../models/schedule.model";
import {map} from "rxjs/operators";
import {DestinationService} from "../../services/destination.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  searchResults: string[] = [];
  destinations?: any[];
  private searchTerms = new Subject<string>();

  constructor(private scheduleService: ScheduleService , private destinationService: DestinationService) {}

  ngOnInit() {
    this.destinationService.getDestinations().subscribe(
      data => this.destinations = data,
      error => console.error('Error fetching destinations', error)
    );
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        return this.scheduleService.getSchedules().pipe(
          map(schedules => this.getUniqueArrivalCities(schedules, term))
        );
      })
    ).subscribe(filteredCities => {
      this.searchResults = filteredCities;
    });
  }

  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchTerms.next(searchTerm);
  }

  private getUniqueArrivalCities(schedules: Schedule[], searchTerm: string): string[] {
    return [...new Set(schedules
      .map(schedule => schedule.route?.arrivalCity)
      .filter(city => city && city.toLowerCase().includes(searchTerm.toLowerCase()))
    )];
  }
}

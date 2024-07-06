import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-routes-page',
  templateUrl: './routes-page.component.html',
  styleUrls: ['./routes-page.component.css']
})
export class RoutesPageComponent implements OnInit{

  isOneWay: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  onTripTypeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.isOneWay = input.value === 'one-way';
  }

}

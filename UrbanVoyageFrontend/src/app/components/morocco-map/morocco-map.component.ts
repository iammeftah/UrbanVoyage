import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { locations } from '../../data/locations.data';

@Component({
  selector: 'app-morocco-map',
  templateUrl: './morocco-map.component.html',
  styleUrls: ['./morocco-map.component.css']
})
export class MoroccoMapComponent implements OnInit, AfterViewInit {
  @Output() citiesSelected = new EventEmitter<{ departure: string, arrival: string, distance: number }>();
  @Output() closeModal = new EventEmitter<void>();
  @Output() searchRoutes = new EventEmitter<void>();

  private map!: L.Map;
  departureCity: string | null = null;
  arrivalCity: string | null = null;
  distance: number = 0;
  private cityMarkers: { [key: string]: L.Marker } = {};
  private routeLine: L.Polyline | null = null;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [31.7917, -7.0926],
      zoom: 6,
      minZoom: 5,
      maxZoom: 7,
      zoomControl: false,
      zoomSnap: 0.1,
      zoomDelta: 0.5
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.addCustomControls();
    this.addCityMarkers();
  }

  private addCustomControls(): void {
    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);

    const customControl = L.Control.extend({
      options: {
        position: 'topright'
      },
      onAdd: () => {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.innerHTML = `
          <button class="reset-zoom bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            Reset View
          </button>
        `;
        container.onclick = () => {
          this.map.setView([31.7917, -7.0926], 6);
        };
        return container;
      }
    });

    this.map.addControl(new customControl());
  }

  private addCityMarkers(): void {
    locations.forEach(location => {
      const cityIcon = L.divIcon({
        className: 'city-marker',
        html: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#14b8a6" width="24" height="24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      });

      const marker = L.marker([location.lat, location.lng], { icon: cityIcon })
        .addTo(this.map)
        .on('click', () => this.onMarkerClick(location.name));

      this.cityMarkers[location.name] = marker;

      const element = marker.getElement();
      if (element) {
        element.classList.add('transition-all', 'duration-100', 'ease-in-out');
        element.addEventListener('mouseover', () => this.onMarkerHover(location.name, true));
        element.addEventListener('mouseout', () => this.onMarkerHover(location.name, false));
      }
    });
  }

  private onMarkerClick(cityName: string): void {
    if (!this.departureCity) {
      this.departureCity = cityName;
      this.setActiveMarker(cityName);
    } else if (!this.arrivalCity && cityName !== this.departureCity) {
      this.arrivalCity = cityName;
      this.setActiveMarker(cityName);
      this.drawRoute();
    } else {
      this.clearRoute();
      this.clearActiveMarkers();
      this.departureCity = cityName;
      this.arrivalCity = null;
      this.setActiveMarker(cityName);
    }
    this.updateFooter();
  }

  private onMarkerHover(cityName: string, isHovering: boolean): void {
    const element = this.cityMarkers[cityName].getElement();
    if (element) {
      if (isHovering) {
        element.classList.add('hover:scale-110', 'hover:text-teal-500');
      } else {
        element.classList.remove('hover:scale-110', 'hover:text-teal-500');
      }
    }
  }

  private setActiveMarker(cityName: string): void {
    const element = this.cityMarkers[cityName].getElement();
    if (element) {
      element.classList.add('active', 'text-teal-500');
    }
  }

  private clearActiveMarkers(): void {
    Object.values(this.cityMarkers).forEach(marker => {
      const element = marker.getElement();
      if (element) {
        element.classList.remove('active', 'text-teal-500');
      }
    });
  }

  private drawRoute(): void {
    if (this.departureCity && this.arrivalCity) {
      const departure = locations.find(loc => loc.name === this.departureCity);
      const arrival = locations.find(loc => loc.name === this.arrivalCity);

      if (departure && arrival) {
        this.clearRoute();
        this.routeLine = L.polyline([], {
          color: '#14b8a6',
          weight: 4,
          opacity: 0.8,
          dashArray: '10, 10'
        }).addTo(this.map);

        const points = [
          [departure.lat, departure.lng],
          [arrival.lat, arrival.lng]
        ];

        let i = 0;
        const animateRoute = () => {
          if (i < points.length) {
            this.routeLine?.addLatLng(points[i] as L.LatLngExpression);
            i++;
            requestAnimationFrame(animateRoute);
          } else {
            this.map.fitBounds(this.routeLine!.getBounds(), { padding: [50, 50], duration: 0.3 });
          }
        };

        animateRoute();
        this.distance = this.calculateDistance(departure, arrival);
      }
    }
  }

  private clearRoute(): void {
    if (this.routeLine) {
      this.map.removeLayer(this.routeLine);
      this.routeLine = null;
    }
    this.distance = 0;
  }

  private calculateDistance(point1: any, point2: any): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(point2.lat - point1.lat);
    const dLon = this.deg2rad(point2.lng - point1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(point1.lat)) * Math.cos(this.deg2rad(point2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance);
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private updateFooter(): void {
    if (this.departureCity && this.arrivalCity) {
      this.citiesSelected.emit({
        departure: this.departureCity,
        arrival: this.arrivalCity,
        distance: this.distance
      });
    }
  }

  confirmSelection(): void {
    if (this.departureCity && this.arrivalCity) {
      this.citiesSelected.emit({
        departure: this.departureCity,
        arrival: this.arrivalCity,
        distance: this.distance
      });
    }
    this.searchRoutes.emit();
  }

  closeMapModal(): void {
    this.closeModal.emit();
  }
}

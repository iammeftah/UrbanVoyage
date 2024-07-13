import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import * as L from 'leaflet';

Chart.register(...registerables);

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

// Define our own AgencyLocation interface
interface AgencyLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent implements OnInit {
  faqs: FAQ[] = [
    {
      question: 'What is the cancellation policy?',
      answer: 'Our cancellation policy allows for full refunds up to 48 hours before the tour start time.',
      isOpen: false
    },
    {
      question: 'Do you offer group discounts?',
      answer: 'Yes, we offer group discounts for parties of 6 or more. Please contact us for more information.',
      isOpen: false
    },
    {
      question: 'What is included in the tour price?',
      answer: 'Our tour prices typically include transportation, guide services, and entrance fees to attractions. Meals and personal expenses are not included unless specified.',
      isOpen: false
    }
  ];

  locations: AgencyLocation[] = [
    { name: 'New York', address: '123 Main St, New York, NY 10001', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles', address: '456 Oak St, Los Angeles, CA 90001', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago', address: '789 Elm St, Chicago, IL 60601', lat: 41.8781, lng: -87.6298 },
    { name: 'Miami', address: '321 Palm Ave, Miami, FL 33101', lat: 25.7617, lng: -80.1918 }
  ];

  toggleFAQ(faq: FAQ): void {
    faq.isOpen = !faq.isOpen;
  }

  ngOnInit() {
    this.initUserGrowthChart();
    this.initNationalitiesChart();
    this.initMap();
  }

  initChart() {
    const ctx = document.getElementById('userGrowthChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Number of Users',
          data: [1000, 500, 2800, 2500, 3000, 3500, 4000, 400, 800, 6500, 6300, 8500],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'User Growth Over Time'
          }
        }
      }
    });
  }

  initMap() {
    const map = L.map('map').setView([39.8283, -98.5795], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    this.locations.forEach(location => {
      L.marker([location.lat, location.lng])
        .addTo(map)
        .bindPopup(`<b>${location.name}</b><br>${location.address}`);
    });
  }

  nationalities = [
    { country: 'USA', users: 35 },
    { country: 'UK', users: 25 },
    { country: 'Canada', users: 20 },
    { country: 'Australia', users: 15 },
    { country: 'Other', users: 5 }
  ];



  initUserGrowthChart() {
    const ctx = document.getElementById('userGrowthChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Number of Users',
          data: [1000, 1500, 2800, 3500, 4000, 4500, 5000, 5400, 5800, 6500, 7300, 8500],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'User Growth Over Time'
          }
        }
      }
    });
  }

  initNationalitiesChart() {
    const ctx = document.getElementById('nationalitiesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.nationalities.map(n => n.country),
        datasets: [{
          data: this.nationalities.map(n => n.users),
          backgroundColor: [
            'rgba(6, 182, 212, 0.8)',  // cyan-500
            'rgba(8, 145, 178, 0.8)',  // cyan-600
            'rgba(14, 116, 144, 0.8)', // cyan-700
            'rgba(21, 94, 117, 0.8)',  // cyan-800
            'rgba(22, 78, 99, 0.8)',   // cyan-900
          ],
          borderWidth: 0.5, // Decrease the width of the border
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 20 // Add padding around the chart
        },
        plugins: {
          legend: {
            position: 'right' as const,
            labels: {
              padding: 20, // Add gap between pie chart and legend
            }
          },
          title: {
            display: true,
            text: 'Top User Nationalities'
          }
        },
        animation: {
          duration: 2000,
          loop: false,
        },
        animations: {
          rotation: {
            type: 'number',
            from: 0,
            to: 360,
            loop: true
          }
        },
        hover: {
          mode: 'nearest',
          intersect: true,
        },
        elements: {
          arc: {
            borderWidth: 0,
            hoverBackgroundColor: 'rgba(6, 182, 212, 1)', // Cyan-500 at full opacity
            hoverBorderColor: 'white',
            hoverBorderWidth: 2,
          }
        }
      },
      plugins: [{
        id: 'hoverEffect',
        beforeDraw: (chart: Chart) => {
          const activeElements = chart.getActiveElements();
          if (activeElements.length > 0) {
            const { ctx } = chart;
            const activeElement = activeElements[0];
            const dataset = chart.data.datasets[activeElement.datasetIndex];
            const meta = chart.getDatasetMeta(activeElement.datasetIndex);
            const arc = meta.data[activeElement.index] as any;

            if (dataset.backgroundColor && Array.isArray(dataset.backgroundColor)) {
              ctx.save();
              ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
              ctx.shadowBlur = 10;
              ctx.shadowOffsetX = 5;
              ctx.shadowOffsetY = 5;

              const model = arc.getProps(['startAngle', 'endAngle', 'innerRadius', 'outerRadius']);
              ctx.beginPath();
              ctx.arc(
                arc.x,
                arc.y,
                model.outerRadius * 1.05, // Scale to 105%
                model.startAngle,
                model.endAngle
              );
              ctx.arc(
                arc.x,
                arc.y,
                model.innerRadius,
                model.endAngle,
                model.startAngle,
                true
              );
              ctx.closePath();
              ctx.fillStyle = dataset.backgroundColor[activeElement.index] as string;
              ctx.fill();
              ctx.restore();
            }
          }
        }
      }]
    });
  }
}

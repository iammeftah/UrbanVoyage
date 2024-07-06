import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

interface Slide {
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carouselTrack') carouselTrack!: ElementRef;

  slides: Slide[] = [
    {
      image: "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Machu Picchu, Peru",
      description: "Discover the ancient Inca citadel nestled high in the Andes mountains, a true wonder of the world."
    },
    {
      image: "https://plus.unsplash.com/premium_photo-1675805016128-079d8b813539?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Northern Lights, Iceland",
      description: "Witness the mesmerizing natural light show in the night sky, a truly breathtaking experience."
    },
    {
      image: "https://images.unsplash.com/photo-1526958977630-bc61b30a2009?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Great Barrier Reef, Australia",
      description: "Explore the world's largest coral reef system, a vibrant underwater paradise teeming with marine life."
    },
    {
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1794&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Tokyo, Japan",
      description: "Immerse yourself in the futuristic cityscape, rich culture, and unique blend of tradition and innovation."
    },
    {
      image: "https://images.unsplash.com/photo-1500213721845-709b85a28da0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Bali, Indonesia",
      description: "Experience lush jungles, coastal vistas, and cultural wonders in this tropical paradise."
    }
  ];

  currentSlide = 0;
  intervalId: any;

  ngOnInit() {
    this.startCarousel();
  }

  ngAfterViewInit() {
    this.updateCarouselPosition();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  stopCarousel() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateCarouselPosition();
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.updateCarouselPosition();
    this.stopCarousel();
    this.startCarousel();
  }

  updateCarouselPosition() {
    const trackElement = this.carouselTrack.nativeElement;
    const slideWidth = trackElement.clientWidth;
    trackElement.style.transform = `translateX(-${this.currentSlide * slideWidth}px)`;
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  imports: [CommonModule]
})
export class CarouselComponent implements OES_element_index_uint {
  images: string[] = [
    'assets/img/image1.jpg',
    'assets/img/image2.jpg',
    'assets/img/image3.jpg'
  ];
  currentSlideIndex: number = 0;
  private timeoutId: any;

  constructor() { }

  ngOnInit(): void {
    this.startCarousel();
  }


  startCarousel(): void {
    this.timeoutId = setTimeout(() => {
      this.nextSlide();
      this.startCarousel(); // Llamada recursiva para avanzar al siguiente slide después de 5000 ms
    }, 5000);
  }
  

  stopCarousel(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.images.length;
  }
}

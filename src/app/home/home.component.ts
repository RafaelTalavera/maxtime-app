import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { PublicacionCarreraComponent } from '../publicacion-carrera/components/publicacion-carrera.component';
import { NosotrosComponent } from './nosotros/nosotros.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, PublicacionCarreraComponent, NosotrosComponent]
})
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const carousel = document.querySelector<HTMLElement>('.carousel .image');
    const images = document.querySelectorAll<HTMLImageElement>('.carousel img');

    if (carousel && images.length > 0) {
      let currentIndex = 0;

      function showNextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        const offset = -currentIndex * 100;
        if (carousel) { // Verifica explícitamente si 'carousel' no es null
          carousel.style.transform = `translateX(${offset}%)`;
        }
      }

      setInterval(showNextImage, 3000); // Cambia la imagen cada 3 segundos
    }
  }
}

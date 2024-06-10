import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { CarreraListComponent } from '../publicacion-carrea/components/publicacion-carrea.component';
import { NosotrosComponent } from './nosotros/nosotros.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, CarreraListComponent, NosotrosComponent ]
})
export class HomeComponent implements OnInit, AfterViewInit  {
  @ViewChild(CarouselComponent) carouselComponent!: CarouselComponent;

  ngOnInit(): void {
    // No hay lógica aquí
  }

  ngAfterViewInit(): void {
    // Inicia el carrusel manualmente después de que la vista se haya inicializado
  // this.carouselComponent.startCarousel();
  }
}

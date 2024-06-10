import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PublicacionCarrera } from '../models/publicacion-carrera';
import { CarreraService } from '../service/carrera-services';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormCorredorComponent } from '../../corredor/componente/form-corredor.component';

@Component({
    selector: 'app-carrera-list',
    standalone: true,
    templateUrl: './publicacion-carrea.component.html',
    styleUrls: ['./publicacion-carrea.component.css'],
    imports: [CommonModule, FormCorredorComponent] // Aquí importas CommonModule
})
export class CarreraListComponent implements OnInit {
  carreras: PublicacionCarrera[] = [];

  tipo: string = ''; // Definido en CarreraListComponent
  valor: number = 0; // Definido en CarreraListComponent

  // Obtener una referencia al componente FormCorredorComponent
  @ViewChild(FormCorredorComponent) formCorredorComponent!: FormCorredorComponent;

  constructor(private carreraService: CarreraService, private router: Router) {}

  ngOnInit(): void {
    console.log('ngOnInit function called');
  
    this.carreraService.getCarreras().subscribe(data => {
      console.log('Carreras obtenidas:', data);
      this.carreras = data;
    });
  }
  
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit function called');
    
    // Verificar si formCorredorComponent está inicializado
    if (this.formCorredorComponent) {
      console.log('formCorredorComponent está inicializado');
    } else {
      console.log('formCorredorComponent no está inicializado');
    }
  }

  inscripcion(carreraId: number, distanciaId: number, tipo: string, linkDePago: string): void {
    // Navegar a la página de inscripción y pasar los datos como parte de la URL
    this.router.navigate(['/inscripcion'], { 
      queryParams: { 
        carreraId: carreraId,
        distanciaId: distanciaId,
        tipo: tipo,
        linkDePago: linkDePago
      }
    });
  }
}
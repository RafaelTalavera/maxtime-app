import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PublicacionCarrera } from '../models/publicacion-carrera';
import { CarreraService } from '../service/carrera-services';
import { Router } from '@angular/router';
import { FormCorredorComponent } from '../../corredor/componente/form-corredor.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-carrera-publicacion',
    standalone: true,
    templateUrl: './publicacion-carrera.component.html',
    styleUrls: ['./publicacion-carrera.component.css'],
    imports: [CommonModule, FormCorredorComponent] // Aquí importas CommonModule
    
})
export class PublicacionCarreraComponent implements OnInit {
  carreras: PublicacionCarrera[] = [];

  tipo: string = ''; 
  valor: number = 0; 

  @ViewChild(FormCorredorComponent) formCorredorComponent!: FormCorredorComponent;

  constructor(private carreraService: CarreraService, private router: Router) {}

  ngOnInit(): void {

    this.carreraService.getCarreras().subscribe(data => {
      this.carreras = data;
    });
  }
  
  ngAfterViewInit(): void {
  }

  inscripcion(carreraId: number, distanciaId: number, tipo: string, linkDePago: string): void {
  
    this.router.navigate(['/inscripcion'], { 
      queryParams: { 
        carreraId: carreraId,
        distanciaId: distanciaId,
        tipo: tipo,
        linkDePago: linkDePago
      }
    });
  }

  formatHora(horario: string): string {
    const hora = parseInt(horario.substring(0, 2), 10);
    const minutos = parseInt(horario.substring(3, 5), 10);

    if (hora >= 12) {
      return `${hora - 12}:${minutos} pm`;
    } else {
      return `${hora}:${minutos} am`;
    }
  }
}

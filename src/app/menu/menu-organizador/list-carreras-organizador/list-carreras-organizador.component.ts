import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { CarreasService } from '../../../carrera/services/carreras.service';
import { LoadingService } from '../../../servicios/loading.service';
import { Carrera } from '../../../carrera/models/carrera';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-carreras-organizador',
  standalone: true,
  templateUrl: './list-carreras-organizador.component.html',
  styleUrls: ['./list-carreras-organizador.component.css'],
  imports: [CommonModule],
})
export class ListCarrerasOrganizadorComponent implements OnInit {

  carreras: Carrera[] = [];
  noCarreras: boolean = false;

  constructor(
    private service: CarreasService,
    private router: Router,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadCarreras();
  }

  loadCarreras(): void {
    this.loadingService.startIconChange(); // Inicia el spinner

    this.service.getCarrerasByOrganizador().subscribe({
      next: (carreras) => {
        this.carreras = carreras;
        this.noCarreras = this.carreras.length === 0;
        this.loadingService.stopIconChange(); // Detiene el spinner
      },
      error: () => {
        this.loadingService.stopIconChange(); // Detiene el spinner en caso de error
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar carreras',
          text: 'Hubo un error al cargar las carreras. Por favor, intente nuevamente.',
        });
      }
    });
  }

  asignarDistancia(carreraId: number | undefined, organizadorId: number | undefined): void {
    if (!carreraId || !organizadorId) {
      console.error('Falta carreraId o organizadorId');
      return;
    }
    this.router.navigate(['/distancias', { organizadorId, carreraId }]);
  }
}

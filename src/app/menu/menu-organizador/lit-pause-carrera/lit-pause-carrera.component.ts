import { Component, OnInit } from '@angular/core';
import { Carrera } from '../../../carrera/models/carrera';
import { CarreasService } from '../../../carrera/services/carreras.service';

import { LoadingService } from '../../../servicios/loading.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuOrganizadorService } from '../service/menu.organizador.service';

@Component({
  selector: 'app-lit-pause-carrera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lit-pause-carrera.component.html',
  styleUrl: './lit-pause-carrera.component.css'
})
export class LitPauseCarreraComponent implements OnInit {

  carreras: Carrera[] = [];
  noCarreras: boolean = false;

  constructor(
    private service: CarreasService,
    private menuOrganizadorService: MenuOrganizadorService,
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

  pausarCarrera(id: number, pausa: boolean): void {
    this.menuOrganizadorService.pausarCarrera(id, pausa).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa',
          text: response,
        });
        location.reload(); // Forzar recarga completa
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al pausar carrera',
          text: 'Hubo un problema al intentar pausar la carrera.',
        });
        location.reload(); 
       
      },
    });
  }
  
}  
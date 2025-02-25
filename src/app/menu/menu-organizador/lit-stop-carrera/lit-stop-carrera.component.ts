import { Component, OnInit } from '@angular/core';
import { Carrera } from '../../../carrera/models/carrera';
import { CarreasService } from '../../../carrera/services/carreras.service';
import { MenuOrganizadorService } from '../service/menu.organizador.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../../servicios/loading.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lit-stop-carrera',
  standalone: true,
   imports: [CommonModule],
  templateUrl: './lit-stop-carrera.component.html',
  styleUrl: './lit-stop-carrera.component.css'
})
export class LitStopCarreraComponent implements OnInit {

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

  cerrarInscripcion(id: number, pausa: boolean): void {
    this.menuOrganizadorService.cerrarInscripcion(id, pausa).subscribe({
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CarreasService } from '../../../carrera/services/carreras.service';
import { LoadingService } from '../../../servicios/loading.service';
import { Carrera } from '../../../carrera/models/carrera';
import { CommonModule } from '@angular/common';
import { MenuOrganizadorService } from '../service/menu.organizador.service';

@Component({
  selector: 'app-lit-stop-carrera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lit-stop-carrera.component.html',
  styleUrls: ['./lit-stop-carrera.component.css']
})
export class LitStopCarreraComponent implements OnInit {

  carreras: Carrera[] = [];
  noCarreras: boolean = false;
  organizadorId!: number;

  constructor(
    private service: CarreasService,
    private menuOrganizadorService: MenuOrganizadorService,
    private router: Router,
    public loadingService: LoadingService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.organizadorId = +params['organizadorId'] || 0;
      this.loadCarreras();
    });
  }

  loadCarreras(): void {
    this.loadingService.startIconChange(); // Inicia el spinner

    this.service.findAll(this.organizadorId).subscribe({
      next: (carreras: Carrera[]) => {
        this.carreras = carreras;
        this.noCarreras = this.carreras.length === 0;
        console.log('Carreras obtenidas:', this.carreras);
        this.loadingService.stopIconChange(); // Detiene el spinner
      },
      error: (error: any) => {
        console.error('Error al cargar carreras:', error);
        this.loadingService.stopIconChange();
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
      next: (response: string) => {
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa',
          text: response,
        });
        location.reload(); // Forzar recarga completa
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al pausar carrera',
          text: 'Hubo un problema al intentar pausar la carrera.',
        });
        location.reload();
      }
    });
  }
}

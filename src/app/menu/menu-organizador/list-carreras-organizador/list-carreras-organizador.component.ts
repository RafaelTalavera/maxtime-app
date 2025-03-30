import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CarreasService } from '../../../carrera/services/carreras.service';
import { LoadingService } from '../../../servicios/loading.service';
import { Carrera } from '../../../carrera/models/carrera';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-carreras-organizador',
  templateUrl: './list-carreras-organizador.component.html',
  styleUrls: ['./list-carreras-organizador.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ListCarrerasOrganizadorComponent implements OnInit {

  carreras: Carrera[] = [];
  noCarreras: boolean = false;
  organizadorId!: number; // ID del organizador

  constructor(
    private service: CarreasService,
    private router: Router,
    public loadingService: LoadingService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Se extrae el organizadorId de los parámetros de la ruta
    this.activatedRoute.params.subscribe((params: any) => {
      this.organizadorId = +params['organizadorId'] || 0;
      this.loadCarreras();
    });
  }

  loadCarreras(): void {
    this.loadingService.startIconChange(); // Inicia el spinner

    // Se utiliza findAll con el organizadorId para obtener las carreras
    this.service.findAll(this.organizadorId).subscribe({
      next: (carreras: Carrera[]) => {
        this.carreras = carreras;
        this.noCarreras = this.carreras.length === 0;
        console.log('Carreras obtenidas:', this.carreras);
        this.loadingService.stopIconChange(); // Detiene el spinner
      },
      error: (error: any) => {
        console.error('Error al cargar carreras:', error);
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

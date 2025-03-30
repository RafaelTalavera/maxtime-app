import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { Carrera } from '../../../models/carrera';
import { CarreasService } from '../../../services/carreras.service';
import { LoadingService } from '../../../../servicios/loading.service';

@Component({
  selector: 'app-listado-carreras',
  templateUrl: './listado-carreras.component.html',
  styleUrls: ['./listado-carreras.component.css']
})
export class ListadoCarrerasComponent implements OnInit {
  carreras: Carrera[] = [];
  organizadorId!: number; // ID del organizador extraído de la ruta

  constructor(
    private service: CarreasService,
    private activatedRoute: ActivatedRoute,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.organizadorId = +params['organizadorId']; // Extraer ID del organizador
      this.loadCarreras();
    });
  }

  loadCarreras(): void {
    this.loadingService.startIconChange(); // Inicia el spinner

    // Usamos findAll para obtener las carreras por organizador
    this.service.findAll(this.organizadorId).subscribe({
      next: (data: Carrera[]) => {
        this.carreras = data;
        console.log('Carreras cargadas inicialmente:', this.carreras);
        if (this.carreras.length > 0) {
          // Para cada carrera, llamamos al endpoint de talles (se espera una cadena separada por comas)
          forkJoin(
            this.carreras.map((carrera: Carrera) => this.service.getTallesByCarreraId(carrera.id!))
          ).subscribe({
            next: (tallesResponses: string[]) => {
              this.carreras.forEach((carrera, index) => {
                if (tallesResponses[index]) {
                  // Se actualiza la propiedad talles a partir de la cadena recibida
                  carrera.talles = tallesResponses[index].split(',').map((t: string) => t.trim());
                }
              });
              console.log('Carreras con talles actualizados:', this.carreras);
              this.loadingService.stopIconChange();
            },
            error: (error: any) => {
              console.error('Error al cargar talles:', error);
              this.loadingService.stopIconChange();
            }
          });
        } else {
          this.loadingService.stopIconChange(); // Detiene el spinner si no hay carreras
        }
      },
      error: (error: any) => {
        console.error('Error al cargar carreras:', error);
        this.loadingService.stopIconChange();
      }
    });
  }
}

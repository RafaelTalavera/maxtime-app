import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    this.activatedRoute.params.subscribe(params => {
      this.organizadorId = +params['organizadorId']; // Extraer ID del organizador
      this.loadCarreras();
    });
  }

  loadCarreras(): void {
    this.loadingService.startIconChange(); // Inicia el spinner

    this.service.findCarrerasByUsuarioId(this.organizadorId).subscribe({
      next: (data) => {
        this.carreras = data;
        console.log('Carreras cargadas:', this.carreras);
        this.loadingService.stopIconChange(); // Detiene el spinner
      },
      error: (error) => {
        console.error('Error al cargar carreras:', error);
        this.loadingService.stopIconChange(); // Detiene el spinner en caso de error
      }
    });
  }
}

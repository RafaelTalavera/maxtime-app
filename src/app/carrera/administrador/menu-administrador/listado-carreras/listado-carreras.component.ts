import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Carrera } from '../../../models/carrera';
import { CarreasService } from '../../../services/carreras.service';
import { LoadingService } from '../../../../servicios/loading.service';


@Component({
  selector: 'app-listado-carreras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado-carreras.component.html',
  styleUrls: ['./listado-carreras.component.css']
})
export class ListadoCarrerasComponent implements OnInit {
  carreras: Carrera[] = [];

  constructor(
    private service: CarreasService,
    public loadingService: LoadingService, // Inyecta el servicio de carga
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadingService.startIconChange(); // Inicia el spinner
    this.loadCarreras();
  }

  private loadCarreras(): void {
    this.service.findAllAdministrador().subscribe({
      next: (data: Carrera[]) => {
        this.carreras = data;
        this.loadingService.stopIconChange(); // Detiene el spinner
      },
      error: (error) => {
        console.error('Error al cargar carreras:', error);
        this.loadingService.stopIconChange(); // Detiene el spinner en caso de error
      }
    });
  }
}

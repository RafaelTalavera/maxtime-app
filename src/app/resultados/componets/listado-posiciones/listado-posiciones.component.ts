import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Posicion } from '../../models/posicion';
import { PosicionService } from '../../services/posicion.service';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../../servicios/loading.service';

@Component({
  selector: 'app-listado-posiciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listado-posiciones.component.html',
  styleUrls: ['./listado-posiciones.component.css'] // Asegúrate de que 'styleUrls' esté en plural
})
export class ListadoPosicionesComponent implements OnInit, OnDestroy {
  posiciones: Posicion[] = [];
  filteredPosiciones: Posicion[] = [];
  searchDni: string = '';

  constructor(
    private posicionService: PosicionService,
    private route: ActivatedRoute,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.startIconChange();
    this.route.params.subscribe(params => {
      const carreraId = params['carreraId'];
      this.loadPosiciones(carreraId);
    });
  }

  ngOnDestroy(): void {
    this.loadingService.stopIconChange();
  }

  private loadPosiciones(carreraId: number): void {
    this.posicionService.getPosicionesByCarreraId(carreraId).subscribe({
      next: (data: Posicion[]) => {
        this.posiciones = data;
        this.filteredPosiciones = data;
        this.loadingService.stopIconChange(); // Detener el spinner cuando los datos se hayan cargado
      },
      error: (error) => {
        console.error('Error al cargar posiciones:', error);
        this.loadingService.stopIconChange(); // Asegurarse de detener el spinner en caso de error
      }
    });
  }

  filterPosiciones(): void {
    this.filteredPosiciones = this.posiciones.filter(posicion => 
      posicion.dni.toString().includes(this.searchDni)
    );
  }
}

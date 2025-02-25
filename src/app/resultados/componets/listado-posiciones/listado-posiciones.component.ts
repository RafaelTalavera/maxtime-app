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
  styleUrls: ['./listado-posiciones.component.css']
})
export class ListadoPosicionesComponent implements OnInit, OnDestroy {
  posiciones: Posicion[] = [];
  filteredPosiciones: Posicion[] = [];
  searchDni: string = '';
  uniqueDistances: string[] = [];
  selectedDistance: string = '';
  uniqueSexes: string[] = [];
  selectedSex: string = '';

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
        this.uniqueDistances = [...new Set(data.map(posicion => posicion.distancia))]; // Distancias únicas
        this.uniqueSexes = [...new Set(data.map(posicion => posicion.sexo))]; // Sexos únicos
        this.loadingService.stopIconChange(); 
      },
      error: (error) => {
        console.error('Error al cargar posiciones:', error);
        this.loadingService.stopIconChange();
      }
    });
  }

  filterPosiciones(): void {
    this.filteredPosiciones = this.posiciones.filter(posicion =>
      posicion.dni.toString().includes(this.searchDni) &&
      (this.selectedDistance === '' || posicion.distancia === this.selectedDistance) &&
      (this.selectedSex === '' || posicion.sexo === this.selectedSex)
    );
  }

  filterByDistance(): void {
    this.filterPosiciones(); // Aplica el filtro combinado
  }

  filterBySex(): void {
    this.filterPosiciones(); // Aplica el filtro combinado
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, of } from 'rxjs';
import { Organizador } from '../../organizador/models/organizador';
import { OrganizadoresService } from '../../organizador/services/organizadores.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-organizadores',
  standalone: true,
  templateUrl: './list-organizadores.component.html',
  styleUrls: ['./list-organizadores.component.css'],
  imports: [ CommonModule, FormsModule]
})
export class ListOrganizadoresComponent implements OnInit {
  organizadores: Organizador[] = [];
  dniBusqueda: string = '';
  organizadoresFiltrados: Organizador[] = [];
  showError: boolean = false;

  constructor(private service: OrganizadoresService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrganizadores();
  }

  loadOrganizadores(): void {
    this.service.findAll()
      .pipe(catchError(() => {
        this.showError = true;
        return of([]);
      }))
      .subscribe((organizadores) => {
        this.organizadores = organizadores;
        this.buscarPorDNI();
      });
  }

  buscarPorDNI(): void {
    if (this.dniBusqueda.trim() === '') {
      this.organizadoresFiltrados = this.organizadores;
    } else {
      this.organizadoresFiltrados = this.organizadores.filter(organizador =>
        organizador.dni.toLowerCase().includes(this.dniBusqueda.toLowerCase())
      );
    }
  }

  asignarCarrera(organizadorId: number | undefined): void {
    if (organizadorId === undefined) return;
    this.router.navigate(['/carreras', { organizadorId }]);
  }

  trackByFn(index: number, item: Organizador): number {
    return item.id;
  }
}

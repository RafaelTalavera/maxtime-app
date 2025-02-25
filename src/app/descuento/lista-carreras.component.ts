// lista-carreras.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { CarreraResponse, CodigoDescuentoService } from './descuento-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-carreras',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './lista-carreras.component.html',
  styleUrls: ['./lista-carreras.component.css']
})
export class ListaCarrerasComponent implements OnInit {
  carreras: CarreraResponse[] = [];

  constructor(
    private codigoDescuentoService: CodigoDescuentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCarreras();
  }

  cargarCarreras(): void {
    this.codigoDescuentoService.obtenerCarrerasOrganizador().subscribe({
      next: (resp) => {
        this.carreras = resp;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las carreras del organizador.', 'error');
      }
    });
  }

  crearDescuento(carrera: CarreraResponse): void {

    this.router.navigate(['/descuentos'], {
      queryParams: {
        carreraId: carrera.id,
        organizadorId: carrera.organizadorId
      }
    });
    
  }
}

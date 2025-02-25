// descuentos.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { CodigoDescuento, CodigoDescuentoService } from './descuento-service';

@Component({
  selector: 'app-descuentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './descuentos.component.html',
  styleUrls: ['./descuentos.component.css']
})
export class DescuentosComponent implements OnInit {
  codigos: CodigoDescuento[] = [];
  // Guarda el descuento que se está creando/editando
  selectedCodigo: CodigoDescuento = {} as CodigoDescuento;
  modoEdicion = false;

  constructor(
    private codigoDescuentoService: CodigoDescuentoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1) Leer "carreraId" y "organizadorId" de los query params
    this.route.queryParams.subscribe(params => {
      const carreraIdParam = params['carreraId'];
      const organizadorIdParam = params['organizadorId'];

      // Convertimos a número y los guardamos en el objeto selectedCodigo
      if (carreraIdParam) {
        this.selectedCodigo.carreraId = +carreraIdParam;
      }
      if (organizadorIdParam) {
        this.selectedCodigo.organizadorId = +organizadorIdParam;
      }
      // Opcional: console.log para verificar
      console.log('Recibido de query params:', {
        carreraId: this.selectedCodigo.carreraId,
        organizadorId: this.selectedCodigo.organizadorId
      });
    });

    // 2) Cargar lista de códigos de descuento existentes
    this.obtenerTodosLosCodigos();
  }

  obtenerTodosLosCodigos(): void {
    this.codigoDescuentoService.obtenerTodos().subscribe({
      next: (resp) => {
        this.codigos = resp;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los códigos.', 'error');
      }
    });
  }

  guardarCodigo(): void {
    // Modo edición
    if (this.modoEdicion && this.selectedCodigo.id) {
      // Si hay un ID, usamos editarSinCodigo para no pisar el 'codigo'
      const partialData = { ...this.selectedCodigo } as Partial<CodigoDescuento>;
      delete partialData.codigo;

      this.codigoDescuentoService.editarSinCodigo(this.selectedCodigo.id, partialData)
        .subscribe({
          next: () => {
            Swal.fire('Actualizado', 'El código se actualizó sin modificar el "codigo".', 'success');
            this.obtenerTodosLosCodigos();
            this.cancelarEdicion();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo actualizar el código.', 'error');
          }
        });

    } else {
      // Modo creación: se usan carreraId y organizadorId ya guardados en selectedCodigo
      this.codigoDescuentoService.crearCodigo(this.selectedCodigo)
        .subscribe({
          next: () => {
            Swal.fire('Creado', 'El código se creó correctamente.', 'success');
            this.obtenerTodosLosCodigos();
            this.cancelarEdicion();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo crear el código.', 'error');
          }
        });
    }
  }

  editarCodigo(codigo: CodigoDescuento): void {
    // Se copian los datos del código seleccionado
    this.selectedCodigo = { ...codigo };
    this.modoEdicion = true;
  }

  eliminarCodigo(id: number): void {
    Swal.fire({
      title: '¿Deseas eliminar este código?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.codigoDescuentoService.eliminarCodigo(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El código se eliminó correctamente.', 'success');
            this.obtenerTodosLosCodigos();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el código.', 'error');
          }
        });
      }
    });
  }

  cancelarEdicion(): void {
    this.selectedCodigo = {} as CodigoDescuento;
    this.modoEdicion = false;
  }

  toggleActivo(c: CodigoDescuento): void {
    const nuevoEstado = !c.activo;
    this.codigoDescuentoService.activarDesactivar(c.id, nuevoEstado)
      .subscribe({
        next: (res) => {
          Swal.fire(
            'Estado actualizado',
            `El código con ID ${res.id} fue ${res.activo ? 'activado' : 'desactivado'}.`,
            'success'
          );
          this.obtenerTodosLosCodigos();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo cambiar el estado de activo.', 'error');
        }
      });
  }
}

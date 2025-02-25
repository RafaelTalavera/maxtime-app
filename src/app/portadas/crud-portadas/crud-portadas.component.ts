import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Portada } from '../models/portada';
import { CommonModule } from '@angular/common';
import { FormPortadaComponent } from './for-portada/for-portada.component';
import { PortadasService } from '../service/portadas-services';

@Component({
  selector: 'app-crud-portadas',
  standalone: true,
  templateUrl: './crud-portadas.component.html',
  styleUrls: ['./crud-portadas.component.css'],
  imports: [FormPortadaComponent, CommonModule]
})
export class CrudPortadasComponent implements OnInit {

  portadas: Portada[] = [];
  portadaSelected: Portada = this.createEmptyPortada();

  constructor(private service: PortadasService, private router: Router) { }

  ngOnInit(): void {
    this.loadPortadas();
  }

  // Getter para determinar si no hay portadas
  get noPortadas(): boolean {
    return this.portadas.length === 0;
  }

  loadPortadas(): void {
    this.service.getPortadasByUsuario().subscribe({
      next: (data) => {
        this.portadas = data;
        console.log('Portadas cargadas:', this.portadas);
      },
      error: (err) => {
        console.error('Error al cargar portadas:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar portadas',
          text: 'Hubo un error al cargar las portadas. Intente nuevamente.',
        });
        this.portadas = [];
      }
    });
  }

  addPortada(data: { portada: Portada, file: File | null }): void {
    if (data.portada.id && data.portada.id > 0) {
      this.updatePortada(data.portada, data.file);
    } else {
      this.createPortada(data.portada, data.file);
    }
    this.resetPortadaSelected();
  }

  createPortada(portada: Portada, file: File | null): void {
    Swal.fire({
      title: 'Por favor espere',
      html: '<strong>Creando portada...</strong>',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => { Swal.showLoading(); }
    });
    this.service.createPortada(portada, file as File).subscribe({
      next: (newPortada) => {
        Swal.close();
        console.log('Portada creada:', newPortada);
        this.portadas.push(newPortada);
        Swal.fire({
          icon: 'success',
          title: 'Portada creada',
          text: 'La portada se ha creado con éxito.',
        });
        this.loadPortadas();
      },
      error: (err) => {
        console.error('Error al crear portada:', err);
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error al crear portada',
          text: 'Hubo un error al crear la portada. Intente nuevamente.',
        });
      }
    });
  }

  updatePortada(portada: Portada, file: File | null): void {
    Swal.fire({
      title: 'Por favor espere',
      html: 'Actualizando portada...',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => { Swal.showLoading(); }
    });
    this.service.updatePortada(portada.id, portada, file as File).subscribe({
      next: (updatedPortada) => {
        this.portadas = this.portadas.map(p => p.id === portada.id ? updatedPortada : p);
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Portada actualizada',
          text: 'La portada se ha actualizado con éxito.',
        });
        this.loadPortadas();
      },
      error: (err) => {
        console.error('Error al actualizar portada:', err);
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar portada',
          text: 'Hubo un error al actualizar la portada. Intente nuevamente.',
        });
      }
    });
  }

  onUpdatePortada(portada: Portada): void {
    this.portadaSelected = { ...portada };
  }

  onRemovePortada(id: number): void {
    Swal.fire({
      title: 'Por favor espere',
      text: 'Eliminando portada...',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => { Swal.showLoading(); }
    });
    this.service.deletePortada(id).subscribe({
      next: () => {
        this.portadas = this.portadas.filter(p => p.id !== id);
        Swal.fire({
          icon: 'success',
          title: 'Portada eliminada',
          text: 'La portada se ha eliminado con éxito.',
        });
      },
      error: (err) => {
        console.error('Error al eliminar portada:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar portada',
          text: 'Hubo un error al eliminar la portada. Intente nuevamente.',
        });
      }
    });
  }

  crearCarrera(portada: Portada): void {
    console.log('Navegando a carrera-organizador con portada.id:', portada.id);
    if (portada.id && portada.id > 0) {
      this.router.navigate(['/carrera-organizador'], { queryParams: { portadaId: portada.id } });
    } else {
      console.error('La portada no tiene un id válido:', portada);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La portada no tiene un id válido. No se puede crear la carrera.',
      });
    }
  }

  private createEmptyPortada(): Portada {
    return {
      id: 0,
      titulo: '',
      descripcion: '',
      fecha: '',
      lugar: '',
      estado: false,
      imagenes: [],
      carreras: []
    };
  }

  private resetPortadaSelected(): void {
    this.portadaSelected = this.createEmptyPortada();
  }
}

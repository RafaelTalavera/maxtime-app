import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormCarreraComponent } from "./form-carrera/form-carrera.component";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carrera } from '../../models/carrera';

import { LoadingService } from '../../../servicios/loading.service';
import { CarreasService } from '../../services/carreras.service';

@Component({
  selector: 'app-carrera',
  standalone: true,
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.css'],
  imports: [FormCarreraComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarreraComponent implements OnInit {

  organizadorId!: number;
  carreras: Carrera[] = [];
  carreraSelected: Carrera = this.createEmptyCarrera();
  noCarreras: boolean = false; 
  selectedFiles: File[] = []; // Archivo seleccionado

  constructor(
    private service: CarreasService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public loadingService: LoadingService // Inyectar el servicio de carga
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.organizadorId = +params['organizadorId'] || 0; // Convertir a número
      console.log('Organizador ID:', this.organizadorId);
  
      if (this.organizadorId === 0) {
        console.error('Error: organizadorId no válido.');
        return;
      }
  
      this.loadCarreras();
    });
  }
  
  

  loadCarreras(): void {
    this.loadingService.startIconChange();
  
    this.service.findAll(this.organizadorId).subscribe({
      next: carreras => {
        this.carreras = carreras.map(carrera => ({
          ...carrera,
          fecha: this.formatToDateInput(carrera.fecha),
          fechaDeCierreDeInscripcion: this.formatToDateInput(carrera.fechaDeCierreDeInscripcion),
        }));
        this.noCarreras = this.carreras.length === 0;
        this.loadingService.stopIconChange();
        Swal.close();
      },
      error: () => {
        this.loadingService.stopIconChange();
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar carreras',
          text: 'Hubo un error al cargar las carreras. Por favor, intente nuevamente.',
        });
      }
    });
  }
  

  addCarrera(carrera: Carrera): void {
    if (carrera.id && carrera.id > 0) {
      this.updateCarrera(carrera);
    } else {
      this.createCarrera(carrera);
    }
    this.resetCarreraSelected();
  }
  

  createCarrera(carrera: Carrera): void {
    // Mostrar el mensaje de carga al inicio
    Swal.fire({
        title: 'Por favor espere',
        html: 'Creando carrera...',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    this.service.createCarreraOrganizador(carrera, this.selectedFiles).subscribe({
        next: carreraNew => {
            this.carreras.push(carreraNew); // Agregar la carrera creada a la lista
            Swal.fire({
                icon: 'success',
                title: 'Carrera creada',
                text: 'La carrera se ha creado con éxito.',
            });
            this.loadCarreras(); // Recargar las carreras
        },
        error: () => {
            Swal.fire({
                icon: 'error',
                title: 'Error al crear carrera',
                text: 'Hubo un error al crear la carrera. Por favor, intente nuevamente.',
            });
        }
    });
}


updateCarrera(carrera: Carrera): void {
  // Mostrar el mensaje de carga al inicio
  Swal.fire({
      title: 'Por favor espere',
      html: 'Actualizando carrera...',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
          Swal.showLoading();
      }
  });

  this.service.updateCarrera(carrera, this.selectedFiles.length > 0 ? this.selectedFiles : undefined).subscribe({
      next: carreraUpdated => {
          // Actualizar la lista de carreras
          this.carreras = this.carreras.map(carr => carr.id === carrera.id ? carreraUpdated : carr);
          Swal.fire({
              icon: 'success',
              title: 'Carrera actualizada',
              text: 'La carrera se ha actualizado con éxito.',
          });
          this.loadCarreras(); // Recargar las carreras
      },
      error: () => {
          Swal.fire({
              icon: 'error',
              title: 'Error al actualizar carrera',
              text: 'Hubo un error al actualizar la carrera. Por favor, intente nuevamente.',
          });
      }
  });
}


  onUpdateCarrera(carreraRow: Carrera): void {
    this.carreraSelected = { ...carreraRow };
  
    // Convertir las fechas a formato ISO para los campos de tipo 'date'
    if (this.carreraSelected.fecha) {
      this.carreraSelected.fecha = this.formatToDateInput(this.carreraSelected.fecha);
    }
  
    if (this.carreraSelected.fechaDeCierreDeInscripcion) {
      this.carreraSelected.fechaDeCierreDeInscripcion = this.formatToDateInput(this.carreraSelected.fechaDeCierreDeInscripcion);
    }
  }
  
  /**
   * Convierte una fecha en formato ISO a yyyy-MM-dd, compatible con inputs de tipo date.
   */
  private formatToDateInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes en rango 01-12
    const day = date.getDate().toString().padStart(2, '0'); // Día en rango 01-31
    return `${year}-${month}-${day}`;
  }
  
  
  private convertToISODate(fecha: string): string {
    // Asume que la fecha viene en formato dd/MM/yyyy
    const [day, month, year] = fecha.split('/');
    return `${year}-${month}-${day}`;
  }
  

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files); // Convierte FileList a Array<File>
      console.log('Archivos seleccionados:', this.selectedFiles);
    }
  }
  

  onRemoveCarrera(id: number): void {
    Swal.fire({
      title: 'Por favor espere',
      text: 'Eliminando carrera...',
      icon: 'info',
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.service.remove(id).subscribe(() => {
      this.carreras = this.carreras.filter(carrera => carrera.id !== id);
      Swal.fire({
        icon: 'success',
        title: 'Carrera Eliminada',
        text: 'La carrera se ha eliminado con éxito',
      });
    });
  }

  asignarDistancia(carreraId: number | undefined, organizadorId: number | undefined): void {
    if (organizadorId === undefined || carreraId === undefined) {
      return;
    }
    this.router.navigate(['/distancias', { organizadorId, carreraId }]);
  }

  private createEmptyCarrera(): Carrera {
    return {
      id: 0,
      nombre: '',
      fecha: '',
      fechaDeCierreDeInscripcion: '',
      localidad: '',
      provincia: '',
      pais: '',
      detalles: '',
      contacto: '',
      horario: '',
      estado: false,
      organizadorId: 0,
      talles: [],
      categorias: []  // Agregado para cumplir con el tipo Carrera
    };
  }
  

  private resetCarreraSelected(): void {
    this.carreraSelected = this.createEmptyCarrera();
    this.carreraSelected.organizadorId = this.organizadorId;
  }
}
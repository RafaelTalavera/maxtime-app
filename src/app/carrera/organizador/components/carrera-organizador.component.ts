import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormCarreraComponent } from './form-carrera/form-carrera.component';
import { LoadingService } from '../../../servicios/loading.service';
import { CarreasService } from '../../services/carreras.service';
import { Observable, of } from 'rxjs';
import { Carrera } from '../../models/carrera';

@Component({
  selector: 'app-carrera-organizador',
  standalone: true,
  templateUrl: './carrera-organizador.component.html',
  styleUrls: ['./carrera-organizador.component.css'],
  imports: [FormCarreraComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarreraOrganizadorComponent implements OnInit {
  organizadorId!: number;
  carreras: Carrera[] = [];
  carreraSelected: Carrera = this.createEmptyCarrera();
  noCarreras: boolean = false;
  selectedFiles: File[] = [];       // Archivos de imagen
  selectedAdjuntos: File[] = [];      // Archivos adjuntos (ya transformados)

  constructor(
    private service: CarreasService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.organizadorId = +params['organizadorId'] || 0;
      this.carreraSelected.organizadorId = this.organizadorId;
      console.log('organizadorId:', this.organizadorId);
      this.loadCarreras();
    });

    this.activatedRoute.queryParams.subscribe(query => {
      const portadaId = query['portadaId'];
      console.log('Query param portadaId:', portadaId);
      if (portadaId && +portadaId !== 0) {
        this.carreraSelected.portadaId = +portadaId;
        console.log('Carrera actualizada con portadaId:', this.carreraSelected.portadaId);
        this.loadCarreras();
      } else {
        console.warn('No se recibió un portadaId válido; se mantiene el id actual:', this.carreraSelected.portadaId);
      }
    });
  }

  loadCarreras(): void {
    this.loadingService.startIconChange();
    let load$: Observable<Carrera[]>;
    if (this.carreraSelected.portadaId && this.carreraSelected.portadaId !== 0) {
      load$ = this.service.getCarrerasByPortada(this.carreraSelected.portadaId);
    } else {
      load$ = of([]);
    }
    load$.subscribe({
      next: carreras => {
        this.carreras = (carreras ?? []).map(carrera => ({
          ...carrera,
          fecha: this.formatToDateInput(carrera.fecha),
          fechaDeCierreDeInscripcion: this.formatToDateInput(carrera.fechaDeCierreDeInscripcion)
        }));
        this.noCarreras = this.carreras.length === 0;
        this.loadingService.stopIconChange();
      },
      error: () => {
        this.loadingService.stopIconChange();
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar carreras',
          text: 'Hubo un error al cargar las carreras. Por favor, intente nuevamente.'
        });
        this.carreras = [];
        this.noCarreras = true;
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
    Swal.fire({
      title: 'Por favor espere',
      html: '<strong>Creando carrera...</strong>',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => { Swal.showLoading(); }
    });
    this.service.createCarreraOrganizador(carrera, this.selectedFiles, this.selectedAdjuntos).subscribe({
      next: carreraNew => {
        Swal.close();
        this.carreras.push(carreraNew);
        Swal.fire({
          icon: 'success',
          title: 'Carrera creada',
          text: 'La carrera se ha creado con éxito.'
        });
        this.loadCarreras();
      },
      error: () => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error al crear carrera',
          text: 'Hubo un error al crear la carrera. Por favor, intente nuevamente.'
        });
      }
    });
  }

  updateCarrera(carrera: Carrera): void {
    Swal.fire({
      title: 'Por favor espere',
      html: 'Actualizando carrera...',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => { Swal.showLoading(); }
    });
    this.service.updateCarrera(carrera, this.selectedFiles, this.selectedAdjuntos.length > 0 ? this.selectedAdjuntos : undefined).subscribe({
      next: carreraUpdated => {
        this.carreras = this.carreras.map(carr => carr.id === carrera.id ? carreraUpdated : carr);
        Swal.fire({
          icon: 'success',
          title: 'Carrera actualizada',
          text: 'La carrera se ha actualizado con éxito.'
        });
        this.loadCarreras();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar carrera',
          text: 'Hubo un error al actualizar la carrera. Por favor, intente nuevamente.'
        });
      }
    });
  }

  onUpdateCarrera(carreraRow: Carrera): void {
    this.carreraSelected = { ...carreraRow };
    if (this.carreraSelected.fecha) {
      this.carreraSelected.fecha = this.formatToDateInput(this.carreraSelected.fecha);
    }
    if (this.carreraSelected.fechaDeCierreDeInscripcion) {
      this.carreraSelected.fechaDeCierreDeInscripcion = this.formatToDateInput(this.carreraSelected.fechaDeCierreDeInscripcion);
    }
  }

  private formatToDateInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onFileSelected(event: any, field: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (field === 1) {
        this.selectedFiles[0] = file;
      } else if (field === 2) {
        this.selectedFiles[1] = file;
      }
    }
    console.log('Archivos de imagen seleccionados:', this.selectedFiles);
  }

  // Método para seleccionar adjuntos
  onAdjuntosSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      // Aquí, se asume que se crea un arreglo de Files cuyos nombres se podrán modificar en el formulario
      this.selectedAdjuntos = Array.from(input.files);
    }
    console.log('Adjuntos seleccionados:', this.selectedAdjuntos);
  }

  onRemoveCarrera(id: number): void {
    Swal.fire({
      title: 'Por favor espere',
      text: 'Eliminando carrera...',
      icon: 'info',
      showConfirmButton: false,
      didOpen: () => { Swal.showLoading(); }
    });
    this.service.remove(id).subscribe(() => {
      this.carreras = this.carreras.filter(carrera => carrera.id !== id);
      Swal.fire({
        icon: 'success',
        title: 'Carrera eliminada',
        text: 'La carrera se ha eliminado con éxito.'
      });
    });
  }

  asignarDistancia(carreraId: number | undefined, organizadorId: number | undefined): void {
    if (!carreraId || !organizadorId) {
      console.error('Falta carreraId o organizadorId');
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
      portadaId: 0,
      categorias: []
    };
  }

  private resetCarreraSelected(): void {
    const portadaId = this.carreraSelected.portadaId || 0;
    this.carreraSelected = this.createEmptyCarrera();
    this.carreraSelected.organizadorId = this.organizadorId;
    if (portadaId !== 0) {
      this.carreraSelected.portadaId = portadaId;
    }
    this.selectedFiles = [];
    this.selectedAdjuntos = [];
  }
}

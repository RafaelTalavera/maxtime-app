import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormCarreraComponent } from "./form-carrera/form-carrera.component";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDistanciaComponent } from '../../../distancia/components/form-distancia/form-distancia.component';
import { Carrera } from '../../models/carrera';
import { CarreasService } from '../../services/carreras.service';
import { LoadingService } from '../../../servicios/loading.service';

@Component({
  selector: 'app-carrera',
  standalone: true,
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.css'],
  imports: [FormCarreraComponent, FormDistanciaComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarreraComponent implements OnInit {

  organizadorId!: number;
  carreras: Carrera[] = [];
  carreraSelected: Carrera = this.createEmptyCarrera();
  noCarreras: boolean = false; 
  selectedFile?: File; // Archivo seleccionado

  constructor(
    private service: CarreasService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public loadingService: LoadingService // Inyectar el servicio de carga
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.organizadorId = +params['organizadorId'];
      this.carreraSelected.organizadorId = this.organizadorId;

      this.loadCarreras();
    });
  }

  loadCarreras(): void {
    this.loadingService.startIconChange(); // Iniciar el estado de carga
    Swal.fire({
      title: 'Por favor espere',
      text: 'Cargando carreras...',
      icon: 'info',
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.service.findAll(this.organizadorId).subscribe(carreras => {
      this.carreras = carreras;
      this.noCarreras = this.carreras.length === 0; 
      this.loadingService.stopIconChange(); // Detener el estado de carga
      Swal.close(); // Cerrar el mensaje de carga
    }, error => {
      this.loadingService.stopIconChange(); // Detener el estado de carga en caso de error
      Swal.close(); // Cerrar el mensaje de carga
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar carreras',
        text: 'Hubo un error al cargar las carreras. Por favor, intente nuevamente.',
      });
    });
  }

  addCarrera(carrera: Carrera): void {
    if (carrera.id > 0) {
      this.updateCarrera(carrera);
    } else {
      this.createCarrera(carrera);
    }
    this.resetCarreraSelected();
  }

  createCarrera(carrera: Carrera): void {
    carrera.organizadorId = this.organizadorId;
    Swal.fire({
      title: 'Por favor espere',
      text: 'Creando carrera...',
      icon: 'info',
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.service.create(carrera).subscribe({
      next: carreraNew => {
        this.carreras.push(carreraNew);
        Swal.fire({
          icon: 'success',
          title: 'Carrera Creada',
          text: 'La carrera se ha creado con éxito',
        });
        this.loadCarreras();
      },
      error: error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al Crear',
          text: 'Hubo un error al crear la carrera. Por favor, intente nuevamente.',
        });
      }
    });
  }

  updateCarrera(carrera: Carrera): void {
    Swal.fire({
      title: 'Por favor espere',
      text: 'Actualizando carrera...',
      icon: 'info',
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.service.updateCarrera(carrera, this.selectedFile).subscribe({
      next: carreraUpdated => {
        this.carreras = this.carreras.map(carr => carr.id === carrera.id ? carreraUpdated : carr);
        Swal.fire({
          icon: 'success',
          title: 'Carrera Actualizada',
          text: 'La carrera se ha actualizado con éxito',
        });
        this.loadCarreras();
      },
      error: error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al Actualizar',
          text: 'Hubo un error al actualizar la carrera. Por favor, intente nuevamente.',
        });
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }

  onUpdateCarrera(carreraRow: Carrera): void {
    this.carreraSelected = { ...carreraRow };
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
    };
  }

  private resetCarreraSelected(): void {
    this.carreraSelected = this.createEmptyCarrera();
    this.carreraSelected.organizadorId = this.organizadorId;
  }
}

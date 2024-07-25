import { Component, OnInit } from '@angular/core';
import { Carrera } from '../models/carrera';
import { CarreasService } from '../services/carreras.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormCarreraComponent } from "./form-carrera/form-carrera.component";
import { FormDistanciaComponent } from '../../distancia/components/form-distancia/form-distancia.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  isLoading: boolean = true; 
  carreraSelected: Carrera = this.createEmptyCarrera();
  noCarreras: boolean = false; 

  constructor(
    private service: CarreasService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.organizadorId = +params['organizadorId'];
      this.carreraSelected.organizadorId = this.organizadorId;

      // Cargar las carreras
      this.loadCarreras();
    });
  }

  loadCarreras(): void {
    this.isLoading = true;
    this.service.findAll(this.organizadorId).subscribe(carreras => {
      this.carreras = carreras;
      this.noCarreras = this.carreras.length === 0; 
      this.isLoading = false;
    }, error => {
      console.error('Error al cargar carreras:', error);
      this.isLoading = false;
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
        console.error('Error al crear carrera:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al Crear',
          text: 'Hubo un error al crear la carrera. Por favor, intente nuevamente.',
        });
      }
    });
  }

  updateCarrera(carrera: Carrera): void {
    this.service.updateCarrera(carrera).subscribe({
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
        console.error('Error al actualizar carrera:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al Actualizar',
          text: 'Hubo un error al actualizar la carrera. Por favor, intente nuevamente.',
        });
      }
    });
  }

  onUpdateCarrera(carreraRow: Carrera): void {
    this.carreraSelected = { ...carreraRow };
  }

  onRemoveCarrera(id: number): void {
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

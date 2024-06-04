import { Component, OnInit } from '@angular/core';
import { Carrera } from '../models/carrera';
import { CarreasService } from '../services/carreras.service'; // Asegúrate de que el nombre del servicio esté correctamente escrito
import { Router, ActivatedRoute } from '@angular/router'; 
import Swal from 'sweetalert2';
import { FormCarreraComponent } from "./form-carrera/form-carrera.component";
import { FormDistanciaComponent } from '../../distancia/components/form-distancia/form-distancia.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-carrera',
  standalone: true,
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.css'],
  imports: [FormCarreraComponent, FormDistanciaComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarreraComponent implements OnInit {

  organizadorId!: number;
  carreras: Carrera[] = [];
  carreraSelected: Carrera = new Carrera();

  constructor(
    private service: CarreasService, // Asegúrate de que el nombre del servicio esté correctamente escrito
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.organizadorId = +params['organizadorId'];
      this.carreraSelected = new Carrera();
      this.carreraSelected.organizadorId = this.organizadorId;
    });

    this.service.findAll(this.organizadorId).subscribe(carreras => {
      this.carreras = carreras;
    });
  }

  addCarrera(carrera: Carrera) {
    if (carrera.id > 0) {
      this.service.updateCarrera(carrera).subscribe(carreraUpdated => {
        this.carreras = this.carreras.map(carr => carr.id === carrera.id ? carreraUpdated : carr);
        Swal.fire({
          icon: 'success',
          title: 'Carrera Actualizada',
          text: 'La carrera se ha actualizado con éxito',
        });
      });
    } else {
      carrera.organizadorId = this.organizadorId;
      this.service.create(carrera).subscribe(carreraNew => {
        this.carreras.push(carreraNew);
        Swal.fire({
          icon: 'success',
          title: 'Carrera Creada',
          text: 'La carrera se ha creado con éxito',
        });
      });
    }
    this.carreraSelected = new Carrera();
    this.carreraSelected.organizadorId = this.organizadorId;
  }

  onUpdateCarrera(carreraRow: Carrera) {
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
    console.log('asignarDistancia called with:', { organizadorId, carreraId });
    if (organizadorId === undefined || carreraId === undefined) {
      console.log('One or both IDs are undefined. Exiting method.');
      return;
    }
  
    this.router.navigate(['/distancias', { organizadorId, carreraId }]);
  }
}
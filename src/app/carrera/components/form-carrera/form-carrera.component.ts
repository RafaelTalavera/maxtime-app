import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import flatpickr from 'flatpickr';
import { Carrera } from '../../models/carrera';

@Component({
  selector: 'app-form-carrera',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-carrera.component.html',
  styleUrls: ['./form-carrera.component.css']
})
export class FormCarreraComponent implements AfterViewInit {
  ngAfterViewInit(): void {
  }

  @Input() carrera: Carrera = {
    id: 0,
    nombre: '',
    fecha: '',
    fechaDeCierreDeInscripcion: '',
    localidad: '',
    provincia: '',
    pais: '',
    imagen: '',
    detalles: '',
    contacto: '',
    horario: '',
    estado: false,
    organizadorId: 0,
  };

  @Output() newCarreraEvent = new EventEmitter();


  onSubmit(carreraForm: NgForm): void {
    if (carreraForm.valid) {
      this.newCarreraEvent.emit(this.carrera);
    }
    carreraForm.reset();
    carreraForm.resetForm();
  }

  clean(): void {
    this.carrera = {
      id: 0,
      nombre: '',
      fecha: '',
      fechaDeCierreDeInscripcion: '',
      localidad: '',
      provincia: '',
      pais: '',
      imagen: '',
      detalles: '',
      contacto: '',
      horario: '',
      estado: false,
      organizadorId: 0,
    };
  }
}

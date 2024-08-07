import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Carrera } from '../../../models/carrera';

@Component({
  selector: 'app-form-carrera',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-carrera.component.html',
  styleUrls: ['./form-carrera.component.css']
})
export class FormCarreraComponent implements AfterViewInit {
  ngAfterViewInit(): void {}

  @Input() carrera: Carrera = this.createEmptyCarrera();
  @Output() newCarreraEvent = new EventEmitter<Carrera>();
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(carreraForm: NgForm): void {
    console.log('Formulario de carrera enviado:', carreraForm);
  
    if (carreraForm.valid) {
      console.log('Formulario es válido. Procediendo con la creación o actualización.');
  
      const formData: FormData = new FormData();
      formData.append('carrera', new Blob([JSON.stringify(this.carrera)], { type: 'application/json' }));
      console.log('Datos de la carrera añadidos al FormData:', this.carrera);
  
      if (this.selectedFile) {
        formData.append('file', this.selectedFile, this.selectedFile.name);
        console.log('Archivo añadido al FormData:', this.selectedFile.name);
      } else {
        console.log('No se ha seleccionado ningún archivo.');
      }
      
      // Determina si se trata de una creación o una actualización
      if (this.carrera.id > 0) {
        console.log('ID de carrera mayor a 0. Procediendo con la actualización.');
  
        this.http.put<Carrera>(`https://maxtime-v-001-production.up.railway.app/api/carreras/${this.carrera.id}`, formData)
          .subscribe(
            response => {
              console.log('Respuesta de la actualización recibida:', response);
              this.newCarreraEvent.emit(response);
              carreraForm.resetForm();
              console.log('Formulario de carrera reiniciado.');
            },
            error => {
              console.error('Error al actualizar carrera:', error);
            }
          );
      } else {
        console.log('ID de carrera igual a 0. Procediendo con la creación.');
  
        this.http.post<Carrera>('https://maxtime-v-001-production.up.railway.app/api/carreras', formData)
          .subscribe(
            response => {
              console.log('Respuesta de la creación recibida:', response);
              this.newCarreraEvent.emit(response);
              carreraForm.resetForm();
              console.log('Formulario de carrera reiniciado.');
            },
            error => {
              console.error('Error al crear carrera:', error);
            }
          );
      }
    } else {
      console.log('Formulario no válido. Verifique los campos e intente nuevamente.');
    }
  }
  

  clean(): void {
    this.carrera = this.createEmptyCarrera();
    this.selectedFile = null;
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
}

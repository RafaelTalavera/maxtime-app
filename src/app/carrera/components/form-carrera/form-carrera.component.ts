import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Carrera } from '../../models/carrera';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
    if (carreraForm.valid) {
      const formData: FormData = new FormData();
      formData.append('carrera', new Blob([JSON.stringify(this.carrera)], { type: 'application/json' }));
      if (this.selectedFile) {
        formData.append('file', this.selectedFile, this.selectedFile.name);
      }
      this.http.post<Carrera>('https://maxtime-v-001-production.up.railway.app/api/carreras', formData).subscribe(response => {
        this.newCarreraEvent.emit(response);
        carreraForm.resetForm();
      });
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

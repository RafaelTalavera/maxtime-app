import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Portada } from '../../models/portada';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-portada',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './for-portada.component.html',
  styleUrls: ['./for-portada.component.css']
})
export class FormPortadaComponent {
  @Input() portada: Portada = this.createEmptyPortada();
  // Se emite un objeto que incluye la portada y el archivo seleccionado
  @Output() newPortadaEvent = new EventEmitter<{ portada: Portada, file: File | null }>();
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(portadaForm: NgForm): void {
    if (portadaForm.valid) {
      // Se emite la portada y el archivo para que el padre procese la solicitud
      this.newPortadaEvent.emit({ portada: this.portada, file: this.selectedFile });
      this.resetFormState(portadaForm);
      Swal.fire({
        icon: 'success',
        title: 'Operación exitosa',
        text: 'La portada se ha procesado correctamente.'
      });
    } else {
      Object.keys(portadaForm.controls).forEach(controlName => {
        const control = portadaForm.controls[controlName];
        control.markAsTouched();
      });
    }
  }

  resetFormState(portadaForm: NgForm): void {
    this.selectedFile = null;
    this.clean();
    portadaForm.resetForm();
  }

  clean(): void {
    this.portada = this.createEmptyPortada();
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
}

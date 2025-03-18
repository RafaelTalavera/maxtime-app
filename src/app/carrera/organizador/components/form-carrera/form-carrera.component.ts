import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarreasService } from '../../../services/carreras.service';
import Swal from 'sweetalert2';
import { Carrera } from '../../../models/carrera';

@Component({
  selector: 'app-form-carrera',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-carrera.component.html',
  styleUrls: ['./form-carrera.component.css']
})
export class FormCarreraComponent {
  @Input() carrera: Carrera = this.createEmptyCarrera();
  @Output() newCarreraEvent = new EventEmitter<Carrera>();
  selectedFiles: File[] = []; 
  imagenesError: boolean = false;
  nuevoTalle: string = '';

  // Propiedades para construir una categoría (ya no se agregan campos de forma individual)
  nuevoCampoNombre: string = '';
  nuevoCampoValor: string = '';
  nuevoCampoActivo: boolean = true;
  
  // Se eliminan los métodos y el array de nuevosCampos

  imagen1Error: boolean = false;
  imagen2Error: boolean = false;
 
  constructor(private service: CarreasService) {}

  // Métodos para talles
  agregarTalle(): void {
    if (this.nuevoTalle.trim()) {
      this.carrera.talles.push(this.nuevoTalle.trim());
      this.nuevoTalle = '';
    }
  }

  eliminarTalle(index: number): void {
    this.carrera.talles.splice(index, 1);
  }

  // Método para agregar una categoría usando los inputs directos
  agregarCategoria(): void {
    if (!this.nuevoCampoNombre.trim() || !this.nuevoCampoValor.trim()) {
      Swal.fire('Error', 'Debe ingresar nombre y valor para la categoría.', 'error');
      return;
    }
    const categoria = {
      campos: [{
        nombre: this.nuevoCampoNombre.trim(),
        valor: this.nuevoCampoValor.trim(),
        activo: this.nuevoCampoActivo
      }]
    };
    if (!this.carrera.categorias) {
      this.carrera.categorias = [];
    }
    this.carrera.categorias.push(categoria);
    // Limpiar los inputs de la categoría
    this.nuevoCampoNombre = '';
    this.nuevoCampoValor = '';
    this.nuevoCampoActivo = true;
  }

  eliminarCategoria(index: number): void {
    if (this.carrera.categorias) {
      this.carrera.categorias.splice(index, 1);
    }
  }
  
  onFileSelected(event: Event, field: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 1) {
      if (field === 1) this.imagen1Error = true;
      if (field === 2) this.imagen2Error = true;
      input.value = '';
    } else {
      if (field === 1) this.imagen1Error = false;
      if (field === 2) this.imagen2Error = false;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        if (field === 1) {
          this.selectedFiles[0] = file;
        } else if (field === 2) {
          this.selectedFiles[1] = file;
        }
      }
    }
    console.log('Archivos seleccionados:', this.selectedFiles);
  }
  
  onSubmit(carreraForm: NgForm): void {
    if (carreraForm.valid) {
      Swal.fire({
        title: 'Por favor espere',
        html: '<strong>Procesando su solicitud...</strong>',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => { Swal.showLoading(); }
      });

      console.log('JSON enviado al backend:', JSON.stringify(this.carrera));

      if (this.carrera.id && this.carrera.id > 0) {
        // Edición de carrera
        this.service.updateCarrera(
          this.carrera,
          this.selectedFiles.length > 0 ? this.selectedFiles : undefined
        ).subscribe(
          response => {
            Swal.close();
            console.log('Carrera actualizada con éxito:', response);
            this.newCarreraEvent.emit(response);
            this.resetFormState(carreraForm);
            Swal.fire({
              icon: 'success',
              title: 'Carrera actualizada',
              text: 'La carrera se ha actualizado con éxito.',
            });
          },
          error => {
            Swal.close();
            console.error('Error al actualizar carrera:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar carrera',
              text: 'Hubo un problema al actualizar la carrera. Por favor, intente nuevamente.',
            });
          }
        );
      } else {
        // Creación de carrera
        this.service.createCarreraOrganizador(this.carrera, this.selectedFiles).subscribe(
          response => {
            Swal.close();
            console.log('Carrera creada con éxito:', response);
            this.newCarreraEvent.emit(response);
            this.resetFormState(carreraForm);
            Swal.fire({
              icon: 'success',
              title: 'Carrera creada',
              text: 'La carrera se ha creado con éxito.',
            });
          },
          error => {
            Swal.close();
            console.error('Error al crear carrera:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al crear carrera',
              text: 'Hubo un problema al crear la carrera. Por favor, intente nuevamente.',
            });
          }
        );
      }
    } else {
      Object.keys(carreraForm.controls).forEach(controlName => {
        const control = carreraForm.controls[controlName];
        control.markAsTouched();
      });
    }
  }
  
  private resetFormState(carreraForm: NgForm): void {
    this.selectedFiles = [];
    this.clean();
    carreraForm.resetForm();
  }
 
  clean(): void {
    this.carrera = this.createEmptyCarrera();
    this.selectedFiles = [];
    this.nuevoCampoNombre = '';
    this.nuevoCampoValor = '';
    this.nuevoCampoActivo = true;
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
      categorias: [] // Categorías basadas en campos dinámicos
    };
  }
  
  adjustTextArea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}

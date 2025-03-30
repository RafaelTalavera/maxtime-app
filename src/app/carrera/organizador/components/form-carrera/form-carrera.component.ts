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
  // Usamos un arreglo de objetos para adjuntos con nombre personalizado
  selectedAdjuntos: { file: File, nombre: string }[] = [];
  imagenesError: boolean = false;
  nuevoTalle: string = '';

  // Propiedades para categorías
  nuevoCampoNombre: string = '';
  nuevoCampoValor: string = '';
  nuevoCampoActivo: boolean = true;
  
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

  // Método para agregar una categoría
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
  
  onAdjuntosSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      // Al seleccionar, se crea un objeto con el File y se asigna inicialmente el nombre original.
      this.selectedAdjuntos = Array.from(input.files).map(file => ({ file, nombre: file.name }));
    }
    console.log('Adjuntos seleccionados:', this.selectedAdjuntos);
  }

  // Permite actualizar el nombre del adjunto
  actualizarNombreAdjunto(index: number, nuevoNombre: string): void {
    this.selectedAdjuntos[index].nombre = nuevoNombre;
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
        this.service.updateCarrera(
          this.carrera,
          this.selectedFiles.length > 0 ? this.selectedFiles : undefined,
          this.transformAdjuntosToFiles()
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
        this.service.createCarreraOrganizador(
          this.carrera,
          this.selectedFiles,
          this.transformAdjuntosToFiles()
        ).subscribe(
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
  
  // Transforma cada adjunto en un File con el nombre actualizado
  private transformAdjuntosToFiles(): File[] {
    return this.selectedAdjuntos.map(adj => new File([adj.file], adj.nombre, { type: adj.file.type }));
  }
  
  private resetFormState(carreraForm: NgForm): void {
    this.selectedFiles = [];
    this.selectedAdjuntos = [];
    this.clean();
    carreraForm.resetForm();
  }
 
  clean(): void {
    this.carrera = this.createEmptyCarrera();
    this.selectedFiles = [];
    this.selectedAdjuntos = [];
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
      categorias: []
    };
  }
  
  adjustTextArea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}

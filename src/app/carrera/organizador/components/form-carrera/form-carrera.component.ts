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
  selectedAdjuntos: { file: File, nombre: string }[] = [];
  imagenesError: boolean = false;
  nuevoTalle: string = '';

  // Propiedades para categorías
  nuevoCampoNombre: string = '';
  nuevoCampoValor: string = '';
  nuevoCampoActivo: boolean = true;
  nuevoCampoOrden: number | null = null;  // Nuevo campo para el orden

  imagen1Error: boolean = false;
  imagen2Error: boolean = false;
 
  // Propiedades para edición de talles
  editingTalleIndex: number | null = null;
  editedTalleValue: string = '';

  // Propiedades para edición de categorías
  // Se añade la propiedad 'orden' al objeto de edición
  editedCategoriaCampo: { nombre: string, valor: string, activo: boolean, orden: number | string } | null = null;
  editingCategoriaIndex: number | null = null;

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

  editarTalle(index: number): void {
    this.editingTalleIndex = index;
    this.editedTalleValue = this.carrera.talles[index];
  }

  guardarTalle(index: number): void {
    if (this.editedTalleValue.trim()) {
      this.carrera.talles[index] = this.editedTalleValue.trim();
      this.editingTalleIndex = null;
      this.editedTalleValue = '';
    }
  }

  cancelarEdicionTalle(): void {
    this.editingTalleIndex = null;
    this.editedTalleValue = '';
  }

  // Métodos para categorías
  agregarCategoria(): void {
    if (!this.nuevoCampoNombre.trim() || !this.nuevoCampoValor.trim() || this.nuevoCampoOrden === null) {
      Swal.fire('Error', 'Debe ingresar nombre, valor y orden para la categoría.', 'error');
      return;
    }
    const categoria = {
      campos: [{
        nombre: this.nuevoCampoNombre.trim(),
        valor: this.nuevoCampoValor.trim(),
        activo: this.nuevoCampoActivo,
        orden: this.nuevoCampoOrden.toString()
      }]
    };
    if (!this.carrera.categorias) {
      this.carrera.categorias = [];
    }
    this.carrera.categorias.push(categoria);
    this.nuevoCampoNombre = '';
    this.nuevoCampoValor = '';
    this.nuevoCampoActivo = true;
    this.nuevoCampoOrden = null;
  }

  eliminarCategoria(index: number): void {
    if (this.carrera.categorias) {
      this.carrera.categorias.splice(index, 1);
    }
  }

  editarCategoria(index: number): void {
    this.editingCategoriaIndex = index;
    // Se asume que cada categoría tiene un solo campo en su arreglo 'campos'
    this.editedCategoriaCampo = { ...this.carrera.categorias[index].campos[0] };
  }

  guardarCategoria(index: number): void {
    if (this.editedCategoriaCampo && this.editedCategoriaCampo.nombre.trim() && this.editedCategoriaCampo.valor.trim() && this.editedCategoriaCampo.orden !== null) {
      this.carrera.categorias[index].campos[0] = {
        nombre: this.editedCategoriaCampo.nombre.trim(),
        valor: this.editedCategoriaCampo.valor.trim(),
        activo: this.editedCategoriaCampo.activo,
        orden: this.editedCategoriaCampo.orden.toString()
      };
      this.editingCategoriaIndex = null;
      this.editedCategoriaCampo = null;
    } else {
      Swal.fire('Error', 'Debe ingresar nombre, valor y orden para la categoría.', 'error');
    }
  }

  cancelarEdicionCategoria(): void {
    this.editingCategoriaIndex = null;
    this.editedCategoriaCampo = null;
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
      this.selectedAdjuntos = Array.from(input.files).map(file => ({ file, nombre: file.name }));
    }
    console.log('Adjuntos seleccionados:', this.selectedAdjuntos);
  }

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
    this.nuevoCampoOrden = null;
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

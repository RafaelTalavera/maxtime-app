import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Corredor } from '../../corredor/models/corredor';
import { ControlService } from '../service/control-service';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx'; // Para exportar a Excel
import { CarreraResponseDTO } from '../service/carrera-response.dto';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ControlComponent implements OnInit {
  corredores: Corredor[] = [];
  corredoresFiltrados: Corredor[] = [];
  carreras: CarreraResponseDTO[] = [];
  showError: boolean = false;
  dniBusqueda: string = '';
  selectedCarreraId: number | null = null; 

  constructor(
    private service: ControlService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.service.getCarreras().pipe(
      catchError((error) => {
        this.showError = true;
        return of([]);
      })
    ).subscribe(
      (carreras) => {
        this.carreras = carreras;
        console.log('Carreras recibidas:', carreras);
        if (this.carreras.length > 0) {
          this.selectedCarreraId = this.carreras[0].id; // Asigna el primer valor por defecto
          this.onCarreraSelect(); // Carga datos de la carrera seleccionada
        }
      }
    );
  }
  
  onCarreraSelect(): void {
    if (this.selectedCarreraId !== null) {
      this.service.findAll(this.selectedCarreraId).pipe(
        catchError((error) => {
          if (error.status !== 200) {
            this.showError = true;
          }
          return of([]); 
        })
      ).subscribe(
        (corredores) => {
          console.log('Corredores recibidos:', corredores);
          this.corredores = corredores;
          this.buscarPorDNI(); 
        }
      );
    }
  }

  toggleConfirmado(corredor: Corredor): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea confirmar el estado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.toggleConfirmado(corredor.id).subscribe(
          () => {
            console.log('Confirmado toggled para corredor:', corredor.id);
            const index = this.corredores.findIndex(c => c.id === corredor.id);
            if (index !== -1) {
              this.corredores[index].confirmado = !this.corredores[index].confirmado;
            }
          },
          (error) => {
            console.error('Error actualizando confirmado:', error);
          }
        );
      }
    });
  }

  buscarPorDNI(): void {
    if (this.dniBusqueda.trim() === '') {
      this.corredoresFiltrados = this.corredores;
    } else {
      this.corredoresFiltrados = this.corredores.filter(corredor =>
        corredor.dni.toLowerCase().includes(this.dniBusqueda.toLowerCase())
      );
    }
  }

  trackByFn(index: number, item: Corredor): number {
    return item.id;
  }

  exportToExcel(): void {
    const fileName = 'lista_corredores.xlsx';
    const excelData = this.corredores.map(corredor => ({
      Nombre: corredor.nombre,
      Apellido: corredor.apellido,
      DNI: corredor.dni,
      Nacimiento: corredor.fechaNacimiento,
      Genero: corredor.genero,
      Nacionalidad: corredor.nacionalidad,
      Provincia: corredor.provincia,
      Localidad: corredor.localidad,
      Talle: corredor.talle,
      Categoría: corredor.categoria, // Se incluye categoría
      Teléfono: corredor.telefono,
      Team: corredor.team,
      GS: corredor.grupoSanguinio,
      Carrera: corredor.carrera.nombre,
      Distancia: corredor.distancia.tipo,
      Confirmado: corredor.confirmado ? 'Sí' : 'No'
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, fileName);
  }

  eliminarCorredor(corredorId: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea eliminar este corredor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteCorredor(corredorId).subscribe(
          () => {
            console.log("Corredor eliminado, id:", corredorId);
            this.corredores = this.corredores.filter(corredor => corredor.id !== corredorId);
            Swal.fire('¡Eliminado!', 'El corredor ha sido eliminado correctamente.', 'success');
          },
          (error) => {
            console.error('Error al eliminar corredor:', error);
            Swal.fire('Error', 'No se pudo eliminar el corredor. Intente nuevamente.', 'error');
          }
        );
      }
    });
  }

  editarCorredor(corredor: Corredor): void {
    console.log("Editar corredor invocado, corredor:", corredor);
    Swal.fire({
      title: '<span style="font-size: 24px; font-weight: bold; color: #333;">Editar Corredor</span>',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
          <div style="display: flex; gap: 10px; justify-content: space-between;">
            <div style="flex: 1;">
              <label for="nombre" style="font-size: 12px;">Nombre</label>
              <input id="nombre" class="swal2-input" value="${corredor.nombre}" placeholder="Ingrese el nombre" style="font-size: 12px;">
            </div>
            <div style="flex: 1;">
              <label for="apellido" style="font-size: 12px;">Apellido</label>
              <input id="apellido" class="swal2-input" value="${corredor.apellido}" placeholder="Ingrese el apellido" style="font-size: 12px;">
            </div>
          </div>
          <div style="display: flex; gap: 10px; justify-content: space-between;">
            <div style="flex: 1;">
              <label for="fechaNacimiento" style="font-size: 12px;">Fecha de Nacimiento</label>
              <input id="fechaNacimiento" type="date" class="swal2-input" value="${corredor.fechaNacimiento}" style="font-size: 12px;">
            </div>
            <div style="flex: 1;">
              <label for="genero" style="font-size: 12px;">Género</label>
              <input id="genero" class="swal2-input" value="${corredor.genero}" placeholder="Ingrese el género" style="font-size: 12px;">
            </div>
          </div>
          <div style="display: flex; gap: 10px; justify-content: space-between;">
            <div style="flex: 1;">
              <label for="nacionalidad" style="font-size: 12px;">Nacionalidad</label>
              <input id="nacionalidad" class="swal2-input" value="${corredor.nacionalidad}" placeholder="Ingrese la nacionalidad" style="font-size: 12px;">
            </div>
            <div style="flex: 1;">
              <label for="provincia" style="font-size: 12px;">Provincia</label>
              <input id="provincia" class="swal2-input" value="${corredor.provincia}" placeholder="Ingrese la provincia" style="font-size: 12px;">
            </div>
          </div>
          <div style="display: flex; gap: 10px; justify-content: space-between;">
            <div style="flex: 1;">
              <label for="localidad" style="font-size: 12px;">Localidad</label>
              <input id="localidad" class="swal2-input" value="${corredor.localidad}" placeholder="Ingrese la localidad" style="font-size: 12px;">
            </div>
            <div style="flex: 1;">
              <label for="talle" style="font-size: 12px;">Talle</label>
              <input id="talle" class="swal2-input" value="${corredor.talle}" placeholder="Ingrese el talle" style="font-size: 12px;">
            </div>
          </div>
          <!-- Campo para editar categoría -->
          <div style="display: flex; gap: 10px; justify-content: space-between;">
            <div style="flex: 1;">
              <label for="categoria" style="font-size: 12px;">Categoría</label>
              <input id="categoria" class="swal2-input" value="${corredor.categoria ? corredor.categoria : ''}" placeholder="Ingrese la categoría" style="font-size: 12px;">
            </div>
          </div>
          <div style="display: flex; gap: 10px; justify-content: space-between;">
            <div style="flex: 1;">
              <label for="telefono" style="font-size: 12px;">Teléfono</label>
              <input id="telefono" class="swal2-input" value="${corredor.telefono}" placeholder="Ingrese el teléfono" style="font-size: 12px;">
            </div>
            <div style="flex: 1;">
              <label for="team" style="font-size: 12px;">Equipo</label>
              <input id="team" class="swal2-input" value="${corredor.team}" placeholder="Ingrese el equipo" style="font-size: 12px;">
            </div>
          </div>
          <div style="display: flex; gap: 10px; justify-content: space-between;">
            <div style="flex: 1;">
              <label for="grupoSanguinio" style="font-size: 12px;">Grupo Sanguíneo</label>
              <input id="grupoSanguinio" class="swal2-input" value="${corredor.grupoSanguinio}" placeholder="Ingrese el grupo sanguíneo" style="font-size: 12px;">
            </div>
          </div>
        </div>
      `,
      customClass: {
        popup: 'swal-custom-popup'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
        const apellido = (document.getElementById('apellido') as HTMLInputElement).value;
        const fechaNacimiento = (document.getElementById('fechaNacimiento') as HTMLInputElement).value;
        const genero = (document.getElementById('genero') as HTMLInputElement).value;
        const nacionalidad = (document.getElementById('nacionalidad') as HTMLInputElement).value;
        const provincia = (document.getElementById('provincia') as HTMLInputElement).value;
        const localidad = (document.getElementById('localidad') as HTMLInputElement).value;
        const talle = (document.getElementById('talle') as HTMLInputElement).value;
        const categoria = (document.getElementById('categoria') as HTMLInputElement).value;
        const telefono = (document.getElementById('telefono') as HTMLInputElement).value;
        const team = (document.getElementById('team') as HTMLInputElement).value;
        const grupoSanguinio = (document.getElementById('grupoSanguinio') as HTMLInputElement).value;

        console.log("Valores ingresados:", { nombre, apellido, fechaNacimiento, genero, nacionalidad, provincia, localidad, talle, categoria, telefono, team, grupoSanguinio });

        if (!nombre || !apellido || !fechaNacimiento || !genero || !nacionalidad || !provincia || !localidad || !talle || !telefono || !team || !grupoSanguinio) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return null;
        }

        return { nombre, apellido, fechaNacimiento, genero, nacionalidad, provincia, localidad, talle, categoria, telefono, team, grupoSanguinio };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedCorredor: Corredor = {
          ...corredor,
          ...result.value
        };
        console.log("Corredor actualizado:", updatedCorredor);
        this.service.updateCorredor(corredor.id, updatedCorredor).subscribe(
          (response) => {
            Swal.fire('Éxito', 'El corredor fue actualizado correctamente', 'success');
            this.onCarreraSelect();
          },
          (error) => {
            Swal.fire('Error', 'No se pudo actualizar el corredor', 'error');
          }
        );
      }
    });
  }

  editarDni(corredor: Corredor): void {
    Swal.fire({
      title: 'Editar DNI',
      input: 'text',
      inputValue: corredor.dni,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'El DNI es obligatorio';
        }
        if (!/^\d+$/.test(value)) {
          return 'El DNI debe contener solo números';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const nuevoDni = result.value;
        this.service.updateDni(corredor.id, nuevoDni).subscribe(
          (response) => {
            Swal.fire('Éxito', 'El DNI fue actualizado correctamente', 'success');
            this.onCarreraSelect();
          },
          (error) => {
            Swal.fire('Error', 'No se pudo actualizar el DNI', 'error');
          }
        );
      }
    });
  }
}
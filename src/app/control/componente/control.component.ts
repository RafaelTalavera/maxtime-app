import { Component, OnInit } from '@angular/core';
import { Corredor } from '../../corredor/models/corredor';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlService } from '../service/control-service';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx'; // Importa la biblioteca xlsx
import { CarreraResponseDTO } from '../service/carrera-response.dto';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './control.component.html',
  styleUrl: './control.component.css'
})
export class ControlComponent implements OnInit{

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
            const index = this.corredores.findIndex(c => c.id === corredor.id);
            if (index !== -1) {
              this.corredores[index].confirmado = !this.corredores[index].confirmado;
            }
          },
          (error) => {
            console.error('Error updating confirmado status:', error);
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
      Telefono: corredor.telefono,
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
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';

import Swal from 'sweetalert2';
import { PosicionService } from '../../services/posicion.service';

interface ResultRow {
  posicion: number;
  posicionSexo: number;
  posicionCategoria: number;
  categoria: string;
  numero: number;
  dni: string;
  nombre: string;
  apellido: string;
  chip: string;
  carreraId: string;
  sexo: string;
  finish: string;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-results.component.html',
  styleUrls: ['./upload-results.component.css']
})
export class ResultsComponent {
  data: ResultRow[] = [];
  columns: string[] = [
    'Posición',
    'Posición por Sexo',
    'Posición por Categoría',
    'Categoría',
    'Número',
    'DNI',
    'Nombre',
    'Apellido',
    'Chip',
    'Carrera',
    'Sexo',
    'Finish'
  ];

  constructor(private posicionService: PosicionService) { }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        // Remove header row
        jsonData.shift();
        this.data = jsonData.map((row: any[]): ResultRow => ({
          posicion: row[0],
          posicionSexo: row[1],
          posicionCategoria: row[2],
          categoria: row[3],
          numero: row[4],
          dni: row[5],
          nombre: row[6],
          apellido: row[7],
          chip: row[8],
          carreraId: row[9],
          sexo: row[10],
          finish: row[11]
        }));
      };
      reader.readAsArrayBuffer(file);
    }
  }

  uploadResults(): void {
    Swal.fire({
      title: 'Cargando',
      text: 'Espero mientras la información es ingresada al back end',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.posicionService.createPosiciones(this.data).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Cargado con éxito',
          text: 'Resultados cargados exitosamente'
        }).then(() => {
          // Refrescar la página después de cerrar la alerta
          location.reload();
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Fallo el paso al back end'
        });
      }
    );
  }
}

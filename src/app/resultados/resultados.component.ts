import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

interface ResultRow {
  position: number;
  positionBySex: number;
  positionByCategory: number;
  category: string;
  number: number;
  dni: string;
  name: string;
  surname: string;
  chip: string;
  race: string;
  sex: string;
  finish: string;
}

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css'
})
export class ResultadosComponent {
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
          position: row[0],
          positionBySex: row[1],
          positionByCategory: row[2],
          category: row[3],
          number: row[4],
          dni: row[5],
          name: row[6],
          surname: row[7],
          chip: row[8],
          race: row[9],
          sex: row[10],
          finish: row[11]
        }));
      };
      reader.readAsArrayBuffer(file);
    }
  }
}

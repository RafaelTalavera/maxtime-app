import { Categoria } from './categoria'; // Ajustá la ruta según corresponda

export class Carrera {
  id?: number;
  nombre: string = '';
  fecha: string = '';
  fechaDeCierreDeInscripcion: string = '';
  localidad: string = '';
  provincia: string = '';
  pais: string = '';
  detalles: string = '';
  contacto: string = '';
  horario: string = '';
  estado: boolean = false;
  organizadorId: number = 0;
  pausa?: boolean = false;
  cierre?: boolean = false;
  talles: string[] = [];
  portadaId?: number;
  categorias: Categoria[] = [];  // Agregado para almacenar las categorías
}

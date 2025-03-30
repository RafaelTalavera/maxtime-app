import { Categoria } from "../../carrera/models/categoria";

export class Carrera {
  id!: number;
  nombre!: string;
  fecha!: string;
  fechaDeCierreDeInscripcion!: string;
  localidad!: string;
  provincia!: string;
  pais!: string;
  imagenes: string[] = [];
  detalles!: string;
  contacto!: string;
  horario!: string;
  estado!: boolean;
  cierre!: boolean;
  pausa!: boolean;
  distancias: {
    id: number;
    tipo: string;
    valor: number;
    pagos: {
      metodoPago: string;
      linkDePago: string;
    }[];
  }[] = [];
  categorias: Categoria[] = []; // Relación agregada
  adjuntos: string[] = [];      // Propiedad agregada para los adjuntos

  constructor(data: any) {
    Object.assign(this, data);
    this.distancias = this.distancias || []; // Asegura que sea un array
    this.categorias = this.categorias || []; // Asegura que sea un array
    this.adjuntos = this.adjuntos || [];     // Asegura que sea un array
  }
}

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
  
    constructor(data: any) {
      Object.assign(this, data);
      this.distancias = this.distancias || []; // Asegura que sea un array
    }
  }
  
export class Corredor {
    id!: number;
    nombre!: string;
    apellido!: string;
    dni!: string;
    fechaNacimiento!: string;
    genero!: string;
    nacionalidad!: string;
    provincia!: string;
    localidad!: string;
    talle!: string;
    // Campo opcional para almacenar la combinación de categorías seleccionada
    categoria?: string;
    telefono!: string;
    email!: string;
    team!: string;
    grupoSanguinio!: string;
    codigoDescuento!: string;
    confirmado!: boolean;
    carreraId!: number;
    distanciaId!: number;
    // Relaciones
    carrera!: Carrera;
    distancia!: Distancia;
  }

  export class Carrera {
    id!: number;
    nombre!: string;
    fecha!: string;
    fechaDeCierreDeInscripcion!: string;
    localidad!: string;
    provincia!: string;
    pais!: string;
    imagen!: string;
    detalles!: string;
    contacto!: string;
    horario!: string;
    estado!: boolean;
    organizador!: any;
    distancias!: any;
    // Agregamos propiedades para talles y categorías disponibles en la carrera
    talles!: string[];
    categorias!: string[];
  }

export class Distancia {
    id!: number;
    tipo!: string;
    valor!: number;
    linkDePago!: string;
    carreraId!: number;
    organizadorId!: number;
}
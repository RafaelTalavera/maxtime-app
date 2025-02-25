
export class Portada {
    id!: number;
    titulo!:string;
    descripcion!: string;
    fecha!: string;
    lugar!: string;
    estado: boolean = false;
    imagenes: string[] = [];
    carreras: string[] = [];

    constructor(data?: Partial<Portada>) {
        if (data) {
          Object.assign(this, data);
        }
      }
}
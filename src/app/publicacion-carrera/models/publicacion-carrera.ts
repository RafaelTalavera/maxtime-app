import { Distancia } from "../../distancia/models/distancia";
import { Organizador } from "../../organizador/models/organizador";


export class PublicacionCarrera {
    id!: number;
    nombre: string = '';
    fecha: string = '';
    fechaDeCierreDeInscripcion: string = '';
    localidad: string = '';
    provincia: string = '';
    pais: string = '';
    imagen: string = '';
    detalles: string = '';
    contacto: string = '';
    horario: string = '';
    estado: boolean = false;
    organizador!: Organizador;
    distancias: Distancia[] = [];

    constructor(init?: Partial<PublicacionCarrera>) {
        Object.assign(this, init);
        if (init?.organizador) {
            this.organizador = new Organizador(init.organizador);
        }
        if (init?.distancias) {
            this.distancias = init.distancias.map(d => new Distancia(d));
        }
    }
}
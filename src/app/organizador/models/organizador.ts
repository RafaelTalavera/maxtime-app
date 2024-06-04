export class Organizador {
    id!: number;
    nombre: string = '';
    apellido: string = '';
    dni: string = '';
    email: string = '';
    telefono: string = '';

    constructor(init?: Partial<Organizador>) {
        Object.assign(this, init);
    }
}

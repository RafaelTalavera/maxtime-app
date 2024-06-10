export class Organizador {
    id!: number;
    username: string = '';
    apellido: string = '';
    dni: string = '';
    nombre: string = '';
    telefono: string = '';
    password: string= '';
    

    constructor(init?: Partial<Organizador>) {
        Object.assign(this, init);
    }
}

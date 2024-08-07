export class Distancia {
  id!: number;
  tipo: string = '';
  valor: number = 0;
  pagos: { metodoPago: string; linkDePago: string }[] = [];
  carreraId!: number;
  organizadorId!: number;

  constructor(init?: Partial<Distancia>) {
    Object.assign(this, init);
  }
}

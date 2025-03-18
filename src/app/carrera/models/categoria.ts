export interface Categoria {
  campos: CampoCategoria[];
}

export interface CampoCategoria {
  nombre: string;
  valor: string;
  activo: boolean;
}

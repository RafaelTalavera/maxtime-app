import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _tipo: string = '';
  private _valor: number = 0;

  setTipo(tipo: string) {
    this._tipo = tipo;
  }

  getTipo(): string {
    return this._tipo;
  }

  setValor(valor: number) {
    this._valor = valor;
  }

  getValor(): number {
    return this._valor;
  }
}

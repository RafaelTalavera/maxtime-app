import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Posicion } from '../models/posicion';


@Injectable({
  providedIn: 'root'
})
export class PosicionService {
  private apiUrl = 'https://maxtime-v-001-production.up.railway.app/api/posiciones'; // Ajusta la URL a la de tu backend

  constructor(private http: HttpClient) { }

  createPosiciones(posiciones: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/batch`, posiciones);
  }

  getPosicionesByCarreraId(carreraId: number): Observable<Posicion[]> {
    return this.http.get<Posicion[]>(`${this.apiUrl}/carrera/${carreraId}`);
  }
}

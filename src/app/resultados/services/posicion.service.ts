import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Posicion } from '../models/posicion';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PosicionService {
  private apiUrl = `${environment.apiUrl}/api/posiciones`; 

  constructor(private http: HttpClient) { }

  createPosiciones(posiciones: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/batch`, posiciones);
  }

  getPosicionesByCarreraId(carreraId: number): Observable<Posicion[]> {
    return this.http.get<Posicion[]>(`${this.apiUrl}/carrera/${carreraId}`);
  }
}

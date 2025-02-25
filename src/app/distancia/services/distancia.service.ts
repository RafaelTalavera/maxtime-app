import { Injectable } from '@angular/core';
import { Distancia } from '../models/distancia';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class DistanciaService {
  private readonly BASE_URL = `${environment.apiUrl}/api/distancias`; // Base URL usando environment

  constructor(private http: HttpClient) {}

  findAll(organizadorId: number, carreraId: number): Observable<Distancia[]> {
    const url = `${this.BASE_URL}/organizador/${organizadorId}/carrera/${carreraId}`;
    return this.http.get<Distancia[]>(url).pipe(
      tap((distancias) => console.log('Received distancias:', distancias))
    );
  }

  create(distancia: Distancia): Observable<Distancia> {
    console.log('JSON enviado:', JSON.stringify(distancia, null, 2));
    return this.http.post<Distancia>(this.BASE_URL, distancia);
  }

  updateDistancia(distancia: Distancia): Observable<Distancia> {
    const url = `${this.BASE_URL}/${distancia.id}`;
    return this.http.put<Distancia>(url, distancia);
  }

  remove(id: number): Observable<void> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.delete<void>(url);
  }

  findById(id: number): Observable<Distancia> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.get<Distancia>(url).pipe(
      tap((distancia) => console.log('Received distancia:', distancia))
    );
  }
}

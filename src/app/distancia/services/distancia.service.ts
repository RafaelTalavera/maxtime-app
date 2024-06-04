import { Injectable } from '@angular/core';
import { Distancia } from '../models/distancia';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DistanciaService {

  private distancias: Distancia[] = []

  constructor(private http: HttpClient) { }

  findAll(organizadorId: number, carreraId: number): Observable<Distancia[]> {
    const url = `http://localhost:8080/api/distancias/organizador/${organizadorId}/carrera/${carreraId}`;
    console.log('Generated URL:', url);
  
    return this.http.get<Distancia[]>(url).pipe(
      tap(distancias => console.log('Received distancias:', distancias))
    );
  }

  create(distancia: Distancia): Observable<Distancia> {
    return this.http.post<Distancia>('http://localhost:8080/api/distancias', distancia);
  }

  updateDistancia(distancia: Distancia): Observable<Distancia> {
    const url = `http://localhost:8080/api/distancias/${distancia.id}`;
    return this.http.put<Distancia>(url, distancia);
  }

  remove(id: number): Observable<void> {
    const url = `http://localhost:8080/api/distancias/${id}`;
    return this.http.delete<void>(url);
  }

  // Add the findById method
  findById(id: number): Observable<Distancia> {
    const url = `http://localhost:8080/api/distancias/${id}`;
    return this.http.get<Distancia>(url).pipe(
      tap(distancia => console.log('Received distancia:', distancia))
    );
  }
}

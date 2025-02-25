import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Carrera } from '../models/publicacion-carrera';



@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  private apiUrl = `${environment.apiUrl}/api/carreras`;

  constructor(private http: HttpClient) { }

  getCarreras(): Observable<Carrera[]> {
    const url = `${this.apiUrl}/activas`;
    return this.http.get<Carrera[]>(this.apiUrl).pipe(
      map(data => data.map(item => new Carrera(item)))
    );
  }
 
    getCarrerasByPortada(portadaId: number): Observable<Carrera[]> {
      const url = `${this.apiUrl }/portada/${portadaId}`;
      console.log('Solicitando carreras para portadaId:', portadaId);
      return this.http.get<[]>(url).pipe(
        map((response) => response ?? []),
        tap((response) => console.log('Carreras por portada:', response)),
        catchError((error) => {
          console.error('Error al cargar carreras por portada:', error);
          return of([]); // Retorna un array vacío en caso de error
        })
      );
    }
  
}

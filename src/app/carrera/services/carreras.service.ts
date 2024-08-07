import { Injectable } from '@angular/core';
import { Carrera } from '../models/carrera';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarreasService {

  private apiUrl  = 'https://maxtime-v-001-production.up.railway.app/api/carreras/organizador/';
  private apiUrl2 = 'https://maxtime-v-001-production.up.railway.app/api/carreras/';
  private apiUrl3 = 'https://maxtime-v-001-production.up.railway.app/api/carreras/carrera-organizador';

  constructor(private http: HttpClient) { }

  findAll(organizadorId: number): Observable<Carrera[]> {
    const url = `${this.apiUrl}${organizadorId}`;
    console.log('Find all Solicitando carreras para organizador con ID:', organizadorId);

    return this.http.get<Carrera[]>(url).pipe(
      map(response => response ?? []), // Transforma null a un array vacío
      tap(response => console.log('Respuesta recibida:', response)),
      catchError(error => {
        console.error('Error al cargar carreras:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  findAllAdministrador(): Observable<Carrera[]> {
    const url = 'https://maxtime-v-001-production.up.railway.app/api/carreras';
    return this.http.get<Carrera[]>(url).pipe(
      map(response => response ?? []), // Transforma null a un array vacío
      tap(response => console.log('Respuesta recibida:', response)),
      catchError(error => {
        console.error('Error al cargar carreras:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  create(carrera: Carrera): Observable<Carrera> {
    return this.http.post<Carrera>(this.apiUrl2, carrera).pipe(
      tap(response => console.log('Carrera creada con éxito:', response)),
      catchError(error => {
        console.error('Error al crear carrera:', error);
        return of(carrera); // Retorna la carrera original en caso de error
      })
    );
  }

  createOrganizador(carrera: Carrera): Observable<Carrera> {
    return this.http.post<Carrera>(this.apiUrl3, carrera).pipe(
      tap(response => console.log('Carrera creada con éxito:', response)),
      catchError(error => {
        console.error('Error al crear carrera:', error);
        return of(carrera); // Retorna la carrera original en caso de error
      })
    );
  }

  updateCarrera(carrera: Carrera, file?: File): Observable<Carrera> {
    const url = `${this.apiUrl2}/${carrera.id}`;
    console.log('Enviando JSON al backend:', JSON.stringify(carrera, null, 2));

    // Crear un FormData para enviar los datos como multipart/form-data
    const formData: FormData = new FormData();
    formData.append('carrera', new Blob([JSON.stringify(carrera)], { type: 'application/json' }));

    if (file) {
      formData.append('file', file);
    }

    return this.http.put<Carrera>(url, formData).pipe(
      tap(response => console.log('Carrera actualizada con éxito:', response)),
      catchError(error => {
        console.error('Error al actualizar carrera:', error);
        return of(carrera); // Retorna la carrera original en caso de error
      })
    );
  }

  remove(id: number): Observable<void> {
    const url = `${this.apiUrl2}${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log('Carrera eliminada con éxito')),
      catchError(error => {
        console.error('Error al eliminar carrera:', error);
        return of(undefined); // Retorna undefined en caso de error
      })
    );
  }
}

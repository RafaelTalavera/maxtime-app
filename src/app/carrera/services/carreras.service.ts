import { Injectable } from '@angular/core';
import { Carrera } from '../models/carrera';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarreasService {
  private readonly BASE_URL = `${environment.apiUrl}/api/carreras`;
  private readonly ORGANIZADOR_ENDPOINT = `${this.BASE_URL}/organizador`;
  private readonly CARRERA_ORGANIZADOR_ENDPOINT = `${this.BASE_URL}/carrera-organizador`;

  constructor(private http: HttpClient) {}

  findAll(organizadorId: number): Observable<Carrera[]> {
    const url = `${this.ORGANIZADOR_ENDPOINT}/${organizadorId}`;
    console.log('Find all: Solicitando carreras para organizador con ID:', organizadorId);
    return this.http.get<Carrera[]>(url).pipe(
      map((response) => response ?? []),
      tap((response) => console.log('Respuesta recibida:', response)),
      catchError((error) => {
        console.error('Error al cargar carreras:', error);
        return of([]);
      })
    );
  }

  findAllAdministrador(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.BASE_URL).pipe(
      map((response) => response ?? []),
      tap((response) => console.log('Respuesta recibida:', response)),
      catchError((error) => {
        console.error('Error al cargar carreras:', error);
        return of([]);
      })
    );
  }

  // Para el componente administrador
  create(carrera: Carrera, files?: File[], adjuntos?: File[]): Observable<Carrera> {
    const formData = new FormData();
    formData.append('carrera', JSON.stringify(carrera));
    if (files && files.length > 0) {
      files.forEach((file) => formData.append('files', file, file.name));
    }
    if (adjuntos && adjuntos.length > 0) {
      adjuntos.forEach((file) => formData.append('adjuntos', file, file.name));
    }
    return this.http.post<Carrera>(`${this.BASE_URL}`, formData).pipe(
      tap((response) => console.log('Carrera creada con éxito:', response)),
      catchError((error) => {
        console.error('Error al crear carrera:', error);
        throw error;
      })
    );
  }

  // Para el componente organizador
  createCarreraOrganizador(carrera: Carrera, files?: File[], adjuntos?: File[]): Observable<Carrera> {
    const formData = new FormData();
    // Se elimina organizadorId del objeto para enviar la información sin este campo
    const carreraData = { ...carrera, organizadorId: undefined };
    const carreraJSON = JSON.stringify(carreraData);
    console.log('JSON enviado (carrera-organizador):', carreraJSON);
    formData.append('carrera', carreraJSON);
    if (files && files.length > 0) {
      files.forEach((file) => formData.append('files', file, file.name));
    }
    if (adjuntos && adjuntos.length > 0) {
      adjuntos.forEach((file) => formData.append('adjuntos', file, file.name));
    }

    // Log para verificar el contenido del FormData que se enviará al backend
    console.log('Contenido del FormData:');
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}: ${value.name}`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });

    return this.http.post<Carrera>(this.CARRERA_ORGANIZADOR_ENDPOINT, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    });
  }

  // Editar carrera
  updateCarrera(carrera: Carrera, files?: File[], adjuntos?: File[]): Observable<Carrera> {
    const url = `${this.BASE_URL}/${carrera.id}`;
    const formData = new FormData();
    formData.append('carrera', new Blob([JSON.stringify(carrera)], { type: 'application/json' }));
    if (files && files.length > 0) {
      files.forEach((file) => formData.append('files', file, file.name));
    }
    if (adjuntos && adjuntos.length > 0) {
      adjuntos.forEach((file) => formData.append('adjuntos', file, file.name));
    }
    return this.http.put<Carrera>(url, formData).pipe(
      tap((response) => console.log('Carrera actualizada con éxito:', response)),
      catchError((error) => {
        console.error('Error al actualizar carrera:', error);
        return of(carrera);
      })
    );
  }

  // Eliminar carrera
  remove(id: number): Observable<void> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log('Carrera eliminada con éxito')),
      catchError((error) => {
        console.error('Error al eliminar carrera:', error);
        return of(undefined);
      })
    );
  }

  // Usado para ver todos los talles en el formulario.
  getTallesByCarreraId(carreraId: number): Observable<string> {
    const url = `${this.BASE_URL}/${carreraId}/talles`;
    return this.http.get<string>(url).pipe(
      tap((response) => console.log('Respuesta del servicio (talles):', response))
    );
  }

  getCarrerasByPortada(portadaId: number): Observable<Carrera[]> {
    const url = `${this.BASE_URL}/portada/${portadaId}`;
    console.log('Solicitando carreras para portadaId:', portadaId);
    return this.http.get<Carrera[]>(url).pipe(
      map((response) => response ?? []),
      tap((response) => console.log('Carreras por portada:', response)),
      catchError((error) => {
        console.error('Error al cargar carreras por portada:', error);
        return of([]);
      })
    );
  }

  getCategoriasByCarreraId(carreraId: number): Observable<string[]> {
    const url = `${environment.apiUrl}/api/carreras/${carreraId}/categorias`;
    console.log('Solicitando categorías para carreraId:', carreraId, 'URL:', url);
    return this.http.get<string[]>(url).pipe(
      tap((response) => console.log('Respuesta recibida de categorías:', response)),
      catchError((error) => {
        console.error('Error al obtener categorías:', error);
        return of([]);
      })
    );
  }

  // GET: Obtener contacto de una carrera
getContactoByCarreraId(carreraId: number): Observable<{ telefono: string, email: string }> {
  const url = `${this.BASE_URL}/${carreraId}/contacto`;
  console.log('Solicitando contacto para carrera con ID:', carreraId);
  return this.http.get<{ telefono: string, email: string }>(url).pipe(
    tap((response) => console.log('Respuesta del servicio (contacto):', response)),
    catchError((error) => {
      console.error('Error al obtener contacto de la carrera:', error);
      // Retornamos un objeto vacío o lo que se ajuste a tu manejo de errores
      return of({ telefono: '', email: '' });
    })
  );
}

}

import { Injectable } from '@angular/core';
import { Carrera } from '../models/carrera';
import { HttpClient } from '@angular/common/http';
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
    console.log('Find all Solicitando carreras para organizador con ID:', organizadorId);

    return this.http.get<Carrera[]>(url).pipe(
      map((response) => response ?? []), // Transforma null a un array vacío
      tap((response) => console.log('Respuesta recibida:', response)),
      catchError((error) => {
        console.error('Error al cargar carreras:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  findAllAdministrador(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.BASE_URL).pipe(
      map((response) => response ?? []), // Transforma null a un array vacío
      tap((response) => console.log('Respuesta recibida:', response)),
      catchError((error) => {
        console.error('Error al cargar carreras:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  //para el componente adminstrador
  create(carrera: Carrera, files?: File[]): Observable<Carrera> {
    const formData = new FormData();
    formData.append('carrera', JSON.stringify(carrera));
  
    if (files && files.length > 0) {
      files.forEach((file) => formData.append('files', file, file.name));
    }
  
    return this.http.post<Carrera>(`${this.BASE_URL}`, formData).pipe(
      tap(response => console.log('Carrera creada con éxito:', response)),
      catchError(error => {
        console.error('Error al crear carrera:', error);
        throw error;
      })
    );
  }

  //para el componente organizador 
  createCarreraOrganizador(carrera: Carrera, files?: File[]): Observable<Carrera> {
    const formData = new FormData();
    const carreraData = { ...carrera, organizadorId: undefined }; // Elimina el campo organizadorId
    const carreraJSON = JSON.stringify(carreraData);
    console.log('JSON enviado (carrera-organizador):', carreraJSON);
    formData.append('carrera', carreraJSON);
  
    if (files && files.length > 0) {
      files.forEach((file) => formData.append('files', file, file.name));
    }
  
    return this.http.post<Carrera>(this.CARRERA_ORGANIZADOR_ENDPOINT, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Asegúrate de enviar el token
      }
    });
  }
  
  
  findAllCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.BASE_URL).pipe(
      map((response) => response ?? []), // Transforma null a un array vacío
      tap((response) => console.log('Todas las carreras:', response)),
      catchError((error) => {
        console.error('Error al obtener todas las carreras:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  //Usado en el componente adnistracion. 
  findCarrerasByUsuarioId(organizadorId: number): Observable<Carrera[]> {
    const url = `${this.BASE_URL}/usuario/${organizadorId}`;
    console.log('Solicitando carreras para usuario con ID:', organizadorId);
  
    return this.http.get<Carrera[]>(url).pipe(
      map((response) => response ?? []), // Transforma null a un array vacío
      tap((response) => console.log('Carreras obtenidas para usuario:', response)),
      catchError((error) => {
        console.error('Error al cargar carreras por usuario:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }
  

  getCarrerasByOrganizador(): Observable<Carrera[]> {
    const url = `${this.BASE_URL}/organizador/carrerasOrga`;
    return this.http.get<Carrera[]>(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Agregar el token al header
      },
    }).pipe(
      tap(response => console.log('Carreras obtenidas:', response)),
      catchError(error => {
        console.error('Error al obtener carreras:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }
  


  //Editar carrrera
  updateCarrera(carrera: Carrera, files?: File[]): Observable<Carrera> {
    const url = `${this.BASE_URL}/${carrera.id}`;
    const formData = new FormData();
    formData.append('carrera', new Blob([JSON.stringify(carrera)], { type: 'application/json' }));
  
    // Solo añade las nuevas imágenes si existen
    if (files && files.length > 0) {
      files.forEach((file) => formData.append('files', file, file.name));
    }
  
    return this.http.put<Carrera>(url, formData).pipe(
      tap(response => console.log('Carrera actualizada con éxito:', response)),
      catchError(error => {
        console.error('Error al actualizar carrera:', error);
        return of(carrera); // Retorna la carrera original en caso de error
      })
    );
  }
  

  //Eliminar carrera
  remove(id: number): Observable<void> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log('Carrera eliminada con éxito')),
      catchError((error) => {
        console.error('Error al eliminar carrera:', error);
        return of(undefined); // Retorna undefined en caso de error
      })
    );
  }

  //usuado para ver todos los talles en el formulario.
  getTallesByCarreraId(carreraId: number): Observable<string> {
    const url = `${this.BASE_URL}/${carreraId}/talles`;
    return this.http.get<string>(url).pipe(
      tap(response => console.log('Respuesta del servicio (talles):', response))
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
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }
  
  getCategoriasByCarreraId(carreraId: number): Observable<string[]> {
    const url = `${environment.apiUrl}/api/carreras/${carreraId}/categorias`;
    console.log("Solicitando categorías para carreraId:", carreraId, "URL:", url);
    return this.http.get<string[]>(url).pipe(
      tap(response => console.log("Respuesta recibida de categorías:", response)),
      catchError(error => {
        console.error("Error al obtener categorías:", error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }
  
}

// src/app/services/codigo-descuento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../servicios/local-Storage-Service';


export interface CodigoDescuento {
  id: number;
  codigo: string;
  porcentajeDescuento: number;
  usosDisponibles: number;
  vecesUsuado: number;
  carreraId: number;
  organizadorId: number;
  activo: boolean;
}

// Interfaz de carrera (ajusta según tu backend)
export interface CarreraResponse {
  id: number;
  nombre: string;
  organizadorId: number; 
  // Agrega más campos según tu DTO
}

@Injectable({
  providedIn: 'root'
})
export class CodigoDescuentoService {
  // Rutas base
  private apiUrl = `${environment.apiUrl}/api/codigos-descuento`;
  private carreraUrl = `${environment.apiUrl}/api/carreras`;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  // Manejo de errores centralizado
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      Swal.fire('Error', `${operation} falló: ${error.message}`, 'error');
      return of(result as T);
    };
  }

  // =========================================
  // A) Consumir POST /carreras/carrera-organizador
  //    para crear carrera del organizador.
  // =========================================
  createCarreraOrganizador(carreraRequest: any, files?: File[]): Observable<CarreraResponse> {
    const token = this.localStorageService.getItem('token'); // O getToken()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('carrera', JSON.stringify(carreraRequest));

    if (files) {
      for (const file of files) {
        formData.append('files', file);
      }
    }

    return this.http.post<CarreraResponse>(
      `${this.carreraUrl}/carrera-organizador`,
      formData,
      { headers }
    ).pipe(
      catchError(this.handleError<CarreraResponse>('createCarreraOrganizador'))
    );
  }

  // =========================================
  // B) GET /carreras/organizador/carrerasOrga
  //    para listar las carreras del organizador
  // =========================================
  obtenerCarrerasOrganizador(): Observable<CarreraResponse[]> {
    const token = this.localStorageService.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.get<CarreraResponse[]>(
      `${this.carreraUrl}/organizador/carrerasOrga`,
      { headers }
    ).pipe(
      tap((resp) => {
        console.log('Respuesta de carreras organizador:', resp);
      }),
      catchError(this.handleError<CarreraResponse[]>('obtenerCarrerasOrganizador', []))
    );
  }
  

  // =========================================
  // Métodos previos (validarCodigo, crearCodigo, etc.)
  // =========================================

  validarCodigoDescuento(carreraId: number, codigo: string): Observable<CodigoDescuento | null> {
    const url = `${this.apiUrl}/validar?carreraId=${carreraId}&codigo=${codigo}`;
    return this.http.get<CodigoDescuento>(url).pipe(
      tap(response => {
        if (!response || !response.id) {
          Swal.fire('Código no válido', 'El código de descuento no es válido.', 'error');
          throw new Error('Código no válido');
        }
      }),
      catchError(error => {
        Swal.fire('Error', 'No se pudo validar el código de descuento.', 'error');
        return of(null);
      })
    );
  }

  crearCodigo(codigo: CodigoDescuento): Observable<CodigoDescuento> {
    return this.http.post<CodigoDescuento>(this.apiUrl, codigo).pipe(
      catchError(this.handleError<CodigoDescuento>('crearCodigo'))
    );
  }

  obtenerTodos(): Observable<CodigoDescuento[]> {
    return this.http.get<CodigoDescuento[]>(this.apiUrl).pipe(
      catchError(this.handleError<CodigoDescuento[]>('obtenerTodos', []))
    );
  }

  actualizarCodigo(id: number, codigo: CodigoDescuento): Observable<CodigoDescuento> {
    return this.http.put<CodigoDescuento>(`${this.apiUrl}/${id}`, codigo).pipe(
      catchError(this.handleError<CodigoDescuento>('actualizarCodigo'))
    );
  }

  eliminarCodigo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<void>('eliminarCodigo'))
    );
  }

  editarSinCodigo(id: number, partial: Partial<CodigoDescuento>): Observable<CodigoDescuento> {
    return this.http.patch<CodigoDescuento>(`${this.apiUrl}/editar/${id}`, partial).pipe(
      catchError(this.handleError<CodigoDescuento>('editarSinCodigo'))
    );
  }

  activarDesactivar(id: number, activo: boolean): Observable<CodigoDescuento> {
    return this.http.patch<CodigoDescuento>(`${this.apiUrl}/activo/${id}`, activo)
      .pipe(
        catchError(this.handleError<CodigoDescuento>('activarDesactivar'))
      );
  }
}

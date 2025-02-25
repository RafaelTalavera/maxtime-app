import { Injectable } from '@angular/core';
import { Portada } from '../models/portada';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../../servicios/local-Storage-Service';

@Injectable({
  providedIn: 'root'
})
export class PortadasService {
  private apiUrl = `${environment.apiUrl}/api/portadas`;

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  // 🔹 Obtener portadas del usuario autenticado con el mismo método que ControlService
  getPortadasByUsuario(): Observable<Portada[]> {
    return this.http.get<Portada[]>(`${this.apiUrl}/usuario`, {
      headers: this.getHeaders(),
    }).pipe(
      map(data => data.map(item => new Portada(item))),
      catchError(error => {
        console.error('Error al obtener las portadas del usuario:', error);
        return of([]);
      })
    );
  }

  getPortadaById(id: number): Observable<Portada> {
    return this.http.get<Portada>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      map(data => new Portada(data))
    );
  }

  createPortada(portada: any, file: File): Observable<Portada> {
    const formData = new FormData();
    formData.append('portada', JSON.stringify(portada));
    if (file) {
      formData.append('file', file);
    }
    return this.http.post<Portada>(this.apiUrl, formData, { headers: this.getHeaders() }).pipe(
      map(data => new Portada(data))
    );
  }

  updatePortada(id: number, portada: any, file: File): Observable<Portada> {
    const url = `${this.apiUrl}/${id}`;
    const formData = new FormData();
    formData.append('portada', JSON.stringify(portada));
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<Portada>(url, formData, { headers: this.getHeaders() }).pipe(
      map(data => new Portada(data))
    );
  }

  deletePortada(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getActivePortadas(): Observable<Portada[]> {
    return this.http.get<Portada[]>(`${this.apiUrl}/activas`, { headers: this.getHeaders() }).pipe(
      map(response => response ?? []),
      catchError(error => {
        console.error('Error al cargar portadas activas:', error);
        return of([]);
      })
    );
  }

  // 🔹 Método para obtener el JWT de LocalStorage
  private getHeaders(): HttpHeaders {
    const token = this.localStorageService.getItem('jwtToken');
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }
}

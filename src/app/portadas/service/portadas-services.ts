import { Injectable } from '@angular/core';
import { Portada } from '../models/portada';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortadasService {
  private apiUrl = `${environment.apiUrl}/api/portadas`;

  constructor(private http: HttpClient) {}

  getPortadas(): Observable<Portada[]> {
    return this.http.get<Portada[]>(this.apiUrl).pipe(
      map(data => data.map(item => new Portada(item)))
    );
  }

  getPortadaById(id: number): Observable<Portada> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Portada>(url).pipe(
      map(data => new Portada(data))
    );
  }

  createPortada(portada: any, file: File): Observable<Portada> {
    const formData = new FormData();
    formData.append('portada', JSON.stringify(portada));
    if (file) {
      formData.append('file', file);
    }
    return this.http.post<Portada>(this.apiUrl, formData).pipe(
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
    return this.http.put<Portada>(url, formData).pipe(
      map(data => new Portada(data))
    );
  }

  deletePortada(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  getActivePortadas(): Observable<Portada[]> {
    const url = `${this.apiUrl}/activas`;
    return this.http.get<Portada[]>(url).pipe(
      map(response => response ?? []),
      catchError(error => {
        console.error('Error al cargar portadas activas:', error);
        return of([]);
      })
    );
  }
}

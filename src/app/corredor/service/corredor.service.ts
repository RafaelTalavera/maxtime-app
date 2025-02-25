import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Corredor } from '../models/corredor';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CorredorService {
  private readonly BASE_URL = `${environment.apiUrl}/api/corredores`;

  constructor(private http: HttpClient) {}

  findAll(dni: string): Observable<Corredor[]> {
    const url = `${this.BASE_URL}/carrera/inscripto/${dni}`;
    return this.http.get<Corredor[]>(url);
  }

  create(corredor: Corredor): Observable<Corredor> {
    console.log('Enviando solicitud POST a:', this.BASE_URL);
    console.log('Cuerpo de la solicitud:', corredor);
    return this.http.post<Corredor>(this.BASE_URL, corredor);
  }

  update(corredor: Corredor): Observable<Corredor> {
    const url = `${this.BASE_URL}/${corredor.id}`;
    return this.http.put<Corredor>(url, corredor);
  }

  delete(id: number): Observable<void> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.delete<void>(url);
  }
}

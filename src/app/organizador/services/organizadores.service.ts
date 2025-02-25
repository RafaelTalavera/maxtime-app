import { Injectable } from '@angular/core';
import { Organizador } from '../models/organizador';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class OrganizadoresService {
  private readonly BASE_URL = `${environment.apiUrl}/api/organizadores`; // Base URL desde environment

  constructor(private http: HttpClient) {}

  findAll(): Observable<Organizador[]> {
    return this.http.get<Organizador[]>(this.BASE_URL);
  }

  create(organizador: Organizador): Observable<Organizador> {
    return this.http.post<Organizador>(this.BASE_URL, organizador);
  }

  updateOrganizador(organizador: Organizador): Observable<Organizador> {
    const url = `${this.BASE_URL}/${organizador.id}`; // Construcción dinámica de URL
    return this.http.put<Organizador>(url, organizador);
  }

  remove(id: number): Observable<void> {
    const url = `${this.BASE_URL}/${id}`; // Construcción dinámica de URL
    return this.http.delete<void>(url);
  }
}

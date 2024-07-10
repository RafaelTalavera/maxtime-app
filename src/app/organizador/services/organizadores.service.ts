import { Injectable } from '@angular/core';
import { Organizador } from '../models/organizador';
import { map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class OrganizadoresService {

  private organizadores: Organizador[] = []

  constructor(private http: HttpClient) { }

  findAll(): Observable<Organizador[]>{
   return this.http.get<Organizador[]>('https://maxtime-v-001-production.up.railway.app/api/organizadores');
  }

  create (organizador: Organizador): Observable<Organizador>{
    return this.http.post<Organizador>('https://maxtime-v-001-production.up.railway.app/api/organizadores',organizador);
  }

  updateOrganizador(organizador: Organizador): Observable<Organizador> {
    const url = 'https://maxtime-v-001-production.up.railway.app/api/organizadores/' + organizador.id;
    return this.http.put<Organizador>(url, organizador);
  }

  remove(id: number): Observable<void> {
    const url = 'https://maxtime-v-001-production.up.railway.app/api/organizadores/' + id;
    return this.http.delete<void>(url);
  }
  
}

import { Injectable } from '@angular/core';
import { Organizador } from '../models/organizador';
import { map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class OrganizadoresService {

  private organizadores: Organizador[] = []

  constructor(private http: HttpClient) { }

  findAll(): Observable<Organizador[]>{
   return this.http.get<Organizador[]>('http://localhost:8080/api/organizadores');
  }

  create (organizador: Organizador): Observable<Organizador>{
    console.log('Carrera enviada al servidor: este', organizador);
    return this.http.post<Organizador>('http://localhost:8080/api/organizadores',organizador);
  }

  updateOrganizador(organizador: Organizador): Observable<Organizador> {
    const url = 'http://localhost:8080/api/organizadores/' + organizador.id;
    return this.http.put<Organizador>(url, organizador);
  }

  remove(id: number): Observable<void> {
    const url = 'http://localhost:8080/api/organizadores/' + id;
    return this.http.delete<void>(url);
  }
  
}

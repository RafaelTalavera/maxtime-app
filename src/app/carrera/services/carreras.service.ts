import { Injectable } from '@angular/core';
import { Carrera } from '../models/carrera';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarreasService {

  private carreas: Carrera[] = []
  
  constructor(private http: HttpClient) { }

  findAll(organizadorId: number): Observable<Carrera[]>{
    const url = 'http://localhost:8080/api/carreras/organizador/' + organizadorId;

    return this.http.get<Carrera[]>(url);

  }

  create (carrera: Carrera): Observable<Carrera>{

    const carreraJson = JSON.stringify(carrera);
    
    return this.http.post<Carrera>('http://localhost:8080/api/carreras', carrera);
  }

  updateCarrera(carrera: Carrera): Observable<Carrera>{
    const url = 'http://localhost:8080/api/carreras/' + carrera.id;
    return this.http.put<Carrera>(url,carrera);
  }

  remove (id: number): Observable<void>{
    const url = 'http://localhost:8080/api/carreras/' + id;
    return this.http.delete<void>(url);
  }

}
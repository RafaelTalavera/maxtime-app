import { Injectable } from '@angular/core';
import { Carrera } from '../models/carrera';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarreasService {

  private carreas: Carrera[] = []

  private apiUrl = 'https://maxtime-v-001-production.up.railway.app/api/carreras/organizador/';

  private apiUrl2 = 'https://maxtime-v-001-production.up.railway.app/api/carreras/';

  
  constructor(private http: HttpClient) { }

  findAll(organizadorId: number): Observable<Carrera[]> {
    const url = this.apiUrl + organizadorId;
    console.log('Solicitando carreras para organizador con ID:', organizadorId);

    return this.http.get<Carrera[]>(url).pipe(
      tap(
        response => console.log('Respuesta recibida:', response),
        error => console.error('Error:', error)
      )
    );
  }

  create (carrera: Carrera): Observable<Carrera>{

    const carreraJson = JSON.stringify(carrera);
    
    return this.http.post<Carrera>('https://maxtime-v-001-production.up.railway.app/api/carreras', carrera);
  }

  updateCarrera(carrera: Carrera): Observable<Carrera> {
    const url = 'https://maxtime-v-001-production.up.railway.app/api/carreras/' + carrera.id;
    console.log('Enviando JSON al backend:', JSON.stringify(carrera, null, 2)); // Agrega esta línea para ver el JSON que se envía
    return this.http.put<Carrera>(url, carrera);
  }


  remove (id: number): Observable<void>{
    const url = 'https://maxtime-v-001-production.up.railway.app/api/carreras/' + id;
    return this.http.delete<void>(url);
  }

}
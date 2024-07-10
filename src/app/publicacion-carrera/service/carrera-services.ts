import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PublicacionCarrera } from '../models/publicacion-carrera';


@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  private apiUrl = 'https://maxtime-v-001-production.up.railway.app/api/carreras/activas';

  constructor(private http: HttpClient) { }

  getCarreras(): Observable<PublicacionCarrera[]> {
    return this.http.get<PublicacionCarrera[]>(this.apiUrl).pipe(
      map(data => data.map(item => new PublicacionCarrera(item)))
    );
  }
}

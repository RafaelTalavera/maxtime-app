import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Corredor } from '../models/corredor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CorredorService {

private corredores: Corredor [] = []

 constructor(private http: HttpClient) { }

 findAll( dni: string): Observable<Corredor[]> {
  const url = 'https://maxtime-v-001-production.up.railway.app/api/corredores/carrera/inscripto/' + dni;
  return this.http.get<Corredor[]>(url).pipe();
}

create (corredor: Corredor): Observable<Corredor>{
  return this.http.post<Corredor>('https://maxtime-v-001-production.up.railway.app/api/corredores' , corredor);
}

updateCorredor(corredor: Corredor): Observable<Corredor>{
  const url = 'https://maxtime-v-001-production.up.railway.app/api/corredores/' + corredor.id;
  return this.http.put<Corredor>(url,corredor);
}

remove (id: number): Observable<void>{
  const url = 'https://maxtime-v-001-production.up.railway.app/api/corredores/' + id;
  return this.http.delete<void>(url);
}


}

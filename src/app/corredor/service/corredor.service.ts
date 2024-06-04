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
  const url = 'http://localhost:8080/api/corredores/carrera/' + dni;
  console.log('Generated URL:', url);

  return this.http.get<Corredor[]>(url).pipe();
}

create (corredor: Corredor): Observable<Corredor>{
  
  console.log('Datos a enviar en el JSON:', corredor);
  return this.http.post<Corredor>('http://localhost:8080/api/corredores' , corredor);
}

updateCorredor(corredor: Corredor): Observable<Corredor>{
  const url = 'http://localhost:8080/api/corredores/' + corredor.id;
  return this.http.put<Corredor>(url,corredor);
}

remove (id: number): Observable<void>{
  const url = 'http://localhost:8080/api/corredores/' + id;
  return this.http.delete<void>(url);
}


}

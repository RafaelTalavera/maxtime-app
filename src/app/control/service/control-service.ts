import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Corredor } from '../../corredor/models/corredor';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  private readonly BASE_URL = 'http://localhost:8080/api/corredores';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Corredor[]> {
    return this.http.get<Corredor[]>(`${this.BASE_URL}/usuario`);
  }

  toggleConfirmado(corredorId: number): Observable<Corredor> {
    return this.http.put<Corredor>(`${this.BASE_URL}/${corredorId}/confirmado`, {});
  }

}

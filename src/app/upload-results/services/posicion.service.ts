// src/app/services/posicion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PosicionService {

  private apiUrl = 'http://localhost:8080/api/posiciones'; // Ajusta la URL a la de tu backend

  constructor(private http: HttpClient) { }

  createPosiciones(posiciones: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/batch`, posiciones);
  }
}

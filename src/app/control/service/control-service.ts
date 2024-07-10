import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Corredor } from '../../corredor/models/corredor';
import { CarreraResponseDTO } from './carrera-response.dto';
import { LocalStorageService } from '../../servicios/local-Storage-Service';


@Injectable({
  providedIn: 'root'
})
export class ControlService {

  private readonly BASE_URL = 'https://maxtime-v-001-production.up.railway.app/api/carreras';
  private readonly BASE_URL2 = 'https://maxtime-v-001-production.up.railway.app/api/corredores';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService // Inyecta el servicio LocalStorageService
  ) { }

  findAll(carreraId: number): Observable<Corredor[]> {
    return this.http.get<Corredor[]>(`${this.BASE_URL2}/carrera/${carreraId}`, {
      headers: this.getHeaders() // Asegura que se incluya el token en este método si es necesario
    });
  }
  
  toggleConfirmado(corredorId: number): Observable<Corredor> {
    return this.http.put<Corredor>(`${this.BASE_URL2}/${corredorId}/confirmado`, {}, {
      headers: this.getHeaders() // Asegura que se incluya el token en este método si es necesario
    });
  }

  getCarreras(): Observable<CarreraResponseDTO[]> {
    return this.http.get<CarreraResponseDTO[]>(`${this.BASE_URL}/organizador/carreras`, {
      headers: this.getHeaders() // Asegura que se incluya el token en esta solicitud
    });
  }

  private getHeaders(): HttpHeaders {
    const token = this.localStorageService.getItem('jwtToken'); // Obtiene el token del localStorage
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }
}

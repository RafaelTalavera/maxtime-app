import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Corredor } from '../../corredor/models/corredor';
import { CarreraResponseDTO } from './carrera-response.dto';
import { LocalStorageService } from '../../servicios/local-Storage-Service';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ControlService {
  private readonly API_BASE = `${environment.apiUrl}/api`; // Usar environment.apiUrl
  private readonly CARRERAS_ENDPOINT = `${this.API_BASE}/carreras`;
  private readonly CORREDORES_ENDPOINT = `${this.API_BASE}/corredores`;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  findAll(carreraId: number): Observable<Corredor[]> {
    return this.http.get<Corredor[]>(`${this.CORREDORES_ENDPOINT}/carrera/${carreraId}`, {
      headers: this.getHeaders(),
    });
  }

  toggleConfirmado(corredorId: number): Observable<Corredor> {
    return this.http.put<Corredor>(`${this.CORREDORES_ENDPOINT}/${corredorId}/confirmado`, {}, {
      headers: this.getHeaders(),
    });
  }

  getCarreras(): Observable<CarreraResponseDTO[]> {
    return this.http.get<CarreraResponseDTO[]>(`${this.CARRERAS_ENDPOINT}/organizador/carreras`, {
      headers: this.getHeaders(),
    });
  }

  deleteCorredor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.CORREDORES_ENDPOINT}/${id}`, {
        headers: this.getHeaders(),
        observe: 'response', // Para obtener la respuesta completa
    }).pipe(
        map((response) => {
            if (response.status === 200) {
                return; // Retorna vacío para indicar éxito
            } else {
                throw new Error(`Error inesperado: ${response.status}`);
            }
        }),
        catchError((error) => {
            console.error('Error en el servidor al eliminar corredor:', error);
            throw error; // Re-lanza el error para manejarlo en el componente
        })
    );
}


  private getHeaders(): HttpHeaders {
    const token = this.localStorageService.getItem('jwtToken');
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  updateCorredor(corredorId: number, corredor: Corredor): Observable<Corredor> {
    return this.http.put<Corredor>(`${this.CORREDORES_ENDPOINT}/${corredorId}`, corredor, {
        headers: this.getHeaders(),
    }).pipe(
        catchError((error) => {
            console.error('Error al actualizar el corredor:', error);
            throw error;
        })
    );
}

updateDni(corredorId: number, nuevoDni: string): Observable<Corredor> {
  const body = { dni: nuevoDni };
  return this.http.put<Corredor>(`${this.CORREDORES_ENDPOINT}/${corredorId}/dni`, body, {
      headers: this.getHeaders(),
  }).pipe(
      catchError((error) => {
          console.error('Error al actualizar el DNI:', error);
          throw error;
      })
  );
}

}

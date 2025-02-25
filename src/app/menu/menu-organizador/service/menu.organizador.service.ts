import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class MenuOrganizadorService {
  private readonly BASE_URL = `${environment.apiUrl}/api/carreras`;

  constructor(private http: HttpClient) {}

  // Método para incluir el JWT en los headers
  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt'); // Asumiendo que el JWT se guarda en localStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Cambiar el estado de pausa
  pausarCarrera(id: number, pausa: boolean): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.put<any>(`${this.BASE_URL}/pausar/${id}`, null, {
      headers,
      params: { pausa: pausa.toString() },
    });
  }
  

  // Cambiar el estado de cierre de inscripción
  cerrarInscripcion(id: number, cierre: boolean): Observable<string> {
    const headers = this.createAuthHeaders();
    return this.http.put<string>(`${this.BASE_URL}/cerrar/${id}`, null, {
      headers,
      params: { cierre: cierre.toString() },
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from '../servicios/local-Storage-Service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth/authenticate`;
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };

    return this.http.post<any>(this.apiUrl, loginData).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  private setToken(token: string): void {
    this.localStorageService.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    const token = this.localStorageService.getItem(this.tokenKey);
    return token;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.localStorageService.removeItem(this.tokenKey);
  }
}

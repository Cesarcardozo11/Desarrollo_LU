import { environment } from '../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegistroRequest } from './auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);

  // Envía email y contraseña al backend.
  // Si el login sale bien, guarda el usuario en localStorage (esa es la "sesión").
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, credentials).pipe(
      tap((response) => {
        if (response.success) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      })
    );
  }

  // Crea un usuario nuevo en el backend (no inicia sesión)
  registrar(datos: RegistroRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/registro`, datos);
  }

  // Borra la sesión
  logout(): void {
    localStorage.removeItem('currentUser');
  }

  // Hay sesión si hay un usuario guardado
  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }
}

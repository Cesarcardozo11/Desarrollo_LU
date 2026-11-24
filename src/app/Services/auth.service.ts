import { environment } from '../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthUser, LoginRequest, LoginResponse, RegistroRequest } from './auth';

// Servicio = clase que guarda lógica compartida (aquí: todo lo de la sesión).
// @Injectable = decorador que marca la clase como servicio para que Angular la pueda "inyectar".
// providedIn: 'root' = Angular crea UNA sola copia para toda la app (todos usan la misma).
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // environment.apiUrl = la dirección de la API (localhost en desarrollo, Railway en producción)
  // `${...}` = template literal: texto con un valor metido adentro
  private readonly url = `${environment.apiUrl}/auth`;
  // HttpClient = la herramienta de Angular para hacer peticiones HTTP al backend
  private http = inject(HttpClient);

  // Envía email y contraseña al backend.
  // Observable<LoginResponse> = una respuesta que llegará DESPUÉS (cuando el backend conteste).
  login(credentials: LoginRequest): Observable<LoginResponse> {
    // http.post = petición POST (enviar datos). <LoginResponse> = la forma de la respuesta
    return this.http.post<LoginResponse>(`${this.url}/login`, credentials).pipe(
      // pipe = "tubería": pasos que se aplican a la respuesta antes de entregarla.
      // tap = hacer algo DE PASO sin cambiar la respuesta (aquí: guardar la sesión).
      tap((response) => {
        if (response.success) {
          // localStorage = pequeño almacén del navegador. Guardamos el usuario = "sesión".
          // JSON.stringify = convierte el objeto en texto (localStorage solo guarda texto)
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      })
    );
  }

  // Crea un usuario nuevo en el backend (no inicia sesión)
  registrar(datos: RegistroRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/registro`, datos);
  }

  // Borra la sesión. void = la función no devuelve nada
  logout(): void {
    localStorage.removeItem('currentUser');
  }

  // Hay sesión si hay un usuario guardado. boolean = devuelve true o false
  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  // Devuelve el usuario que inició sesión (o null si no hay sesión).
  // JSON.parse = convierte el texto guardado otra vez en un objeto
  getUsuario(): AuthUser | null {
    const guardado = localStorage.getItem('currentUser');
    return guardado ? JSON.parse(guardado) : null;
  }
}

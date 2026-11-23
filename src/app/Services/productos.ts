import { environment } from '../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Producto {
  id?: number;
  codigo: string;
  nombre: string;
  categoria: string;
  dispositivo: string;
  precio: number;
  stock: number;
}

// El backend responde { success, data }; aquí solo nos interesa "data"
interface RespuestaApi<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private readonly url = `${environment.apiUrl}/v1/productos`;
  private http = inject(HttpClient);

  getProductos(): Observable<Producto[]> {
    return this.http.get<RespuestaApi<Producto[]>>(this.url).pipe(map((res) => res.data));
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<RespuestaApi<Producto>>(this.url, producto).pipe(map((res) => res.data));
  }
}
